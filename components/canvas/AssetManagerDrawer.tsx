"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type {
  LandingPageData,
  SiteMediaAssets,
  UploadedAssetMeta,
  LogoMode,
} from "@/lib/builder-types";

interface AssetManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
}

export function AssetManagerDrawer({
  isOpen,
  onClose,
  site,
  onChange,
}: AssetManagerDrawerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentAssets = site.assets || {};
  const uploadedList = currentAssets.uploadedAssets || [];

  // Helper to update assets
  const updateAssets = (updates: Partial<SiteMediaAssets>) => {
    const newAssets: SiteMediaAssets = { ...currentAssets, ...updates };
    onChange({ ...site, assets: newAssets });
  };

  // Upload handler for Cloudflare R2
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      toast.error("Please select valid image files.");
      return;
    }

    try {
      setIsUploading(true);
      const newUploadedMetas: UploadedAssetMeta[] = [];

      for (const file of fileArray) {
        if (file.size > 6 * 1024 * 1024) {
          toast.warning(`Skipped ${file.name}: exceeds 6MB limit.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("siteId", site.id || "default");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          newUploadedMetas.push({
            key: data.key,
            url: data.url,
            fileName: data.fileName || file.name,
            size: data.size || file.size,
            mimeType: data.mimeType || file.type,
            uploadedAt: new Date().toISOString(),
          });
        }
      }

      if (newUploadedMetas.length > 0) {
        toast.success(`Uploaded ${newUploadedMetas.length} image(s) to Cloudflare R2 Vault!`);
        updateAssets({
          uploadedAssets: [...newUploadedMetas, ...uploadedList],
        });
      }
    } catch (err) {
      console.error("Batch upload failed:", err);
      toast.error("Upload error. Check Cloudflare R2 credentials.");
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Assign Actions
  const assignAsLogo = (url: string) => {
    const updated = site.sections.map((sec) => {
      if (sec.type === "navbar") {
        return {
          ...sec,
          data: {
            ...sec.data,
            logoMode: "image" as LogoMode,
            logoType: "image" as const,
            logoUrl: url,
          },
        };
      }
      return sec;
    });
    onChange({ ...site, sections: updated });
    toast.success("Set as Brand Logo!");
  };

  const assignAsHero = (url: string) => {
    const updated = site.sections.map((sec) => {
      if (sec.type === "hero") {
        return {
          ...sec,
          data: {
            ...sec.data,
            visualMode: "image" as const,
            imageUrl: url,
          },
        };
      }
      return sec;
    });
    onChange({ ...site, sections: updated });
    toast.success("Set as Hero Banner Image!");
  };

  const assignToDoctor = (docIndex: number, url: string) => {
    const updated = site.sections.map((sec) => {
      if (sec.type === "doctors" && "doctors" in sec.data && Array.isArray(sec.data.doctors)) {
        const docs = [...sec.data.doctors];
        if (docs[docIndex]) {
          docs[docIndex] = { ...docs[docIndex], imageUrl: url };
        }
        return { ...sec, data: { ...sec.data, doctors: docs } };
      }
      return sec;
    });
    onChange({ ...site, sections: updated });
    toast.success(`Assigned photo to Doctor #${docIndex + 1}!`);
  };

  const deleteAsset = (key: string) => {
    const filtered = uploadedList.filter((a) => a.key !== key);
    updateAssets({ uploadedAssets: filtered });
    toast.success("Asset removed from Vault.");
  };

  const copyUrlToClipboard = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.info("Image URL copied to clipboard!");
  };

  const doctorCount =
    (site.sections.find((s) => s.type === "doctors")?.data as { doctors?: unknown[] })?.doctors?.length || 0;

  return (
    <aside className="fixed inset-y-0 right-0 top-16 z-50 w-full max-w-md border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-200 text-[hsl(var(--foreground))]">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border))] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} className="text-[hsl(var(--primary))]" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider font-mono-app">
              Media Vault
            </h3>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] block">
              Cloudflare R2 Bucket Storage
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.05)]"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted)/.3)]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleUploadFiles(e.target.files);
            }}
          />

          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-[hsl(var(--primary))]" />
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                Uploading directly to Cloudflare R2...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] flex items-center justify-center">
                <Upload size={18} />
              </div>
              <div>
                <span className="text-xs font-bold block">Drop images here or click to browse</span>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  Multi-file Cloudflare R2 Upload (PNG, JPG, WebP, SVG)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Asset Library Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
              Uploaded Files ({uploadedList.length})
            </span>
          </div>

          {uploadedList.length === 0 ? (
            <div className="p-8 text-center border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted)/.2)] space-y-1">
              <ImageIcon size={28} className="mx-auto text-[hsl(var(--muted-foreground))] opacity-40 mb-2" />
              <p className="text-xs font-semibold text-[hsl(var(--foreground))]">Your Vault is Empty</p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                Drop your logos, hero photography, or doctor photos above to store them in your R2 vault.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {uploadedList.map((asset) => (
                <div
                  key={asset.key}
                  className="group relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] overflow-hidden flex flex-col shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="h-28 w-full bg-[hsl(var(--muted)/.5)] relative overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.fileName}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => copyUrlToClipboard(asset.key, asset.url)}
                        className="p-1 rounded-md bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedKey === asset.key ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                      <button
                        onClick={() => deleteAsset(asset.key)}
                        className="p-1 rounded-md bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
                        title="Delete from Vault"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* File meta & Quick Assign Menu */}
                  <div className="p-2 space-y-1.5">
                    <div className="truncate">
                      <span className="text-[11px] font-semibold block truncate leading-tight">
                        {asset.fileName}
                      </span>
                      <span className="text-[9px] text-[hsl(var(--muted-foreground))] font-mono-app block">
                        {Math.round(asset.size / 1024)} KB
                      </span>
                    </div>

                    {/* Quick Assign Dropdown Buttons */}
                    <div className="pt-1 border-t border-[hsl(var(--border))] grid grid-cols-2 gap-1">
                      <button
                        onClick={() => assignAsHero(asset.url)}
                        className="text-[10px] py-1 px-1.5 rounded bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold hover:bg-[hsl(var(--primary)/.15)] transition truncate cursor-pointer"
                      >
                        Set Hero
                      </button>
                      <button
                        onClick={() => assignAsLogo(asset.url)}
                        className="text-[10px] py-1 px-1.5 rounded bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold hover:bg-[hsl(var(--primary)/.15)] transition truncate cursor-pointer"
                      >
                        Set Logo
                      </button>
                      {doctorCount > 0 && (
                        <button
                          onClick={() => assignToDoctor(0, asset.url)}
                          className="col-span-2 text-[10px] py-1 px-1.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-medium hover:bg-[hsl(var(--primary)/.1)] transition truncate cursor-pointer"
                        >
                          Assign to Doctor #1
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
