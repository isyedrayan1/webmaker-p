"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (url: string) => void;
  onImageRemoved?: () => void;
  currentImageUrl?: string;
  title?: string;
  siteId?: string;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onImageSelected,
  onImageRemoved,
  currentImageUrl,
  title = "Upload Image",
  siteId = "default",
}: ImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image file is too large (max 6MB).");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("siteId", siteId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Image uploaded successfully!");
      onImageSelected(data.url);
      onClose();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onImageSelected(customUrl.trim());
    toast.success("Image URL applied!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl relative text-[hsl(var(--foreground))]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1 rounded-lg hover:bg-[hsl(var(--muted))]"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
          <ImageIcon size={20} className="text-[hsl(var(--primary))]" />
          {title}
        </h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-5">
          Uploaded images are saved securely to your cloud media library.
        </p>

        {/* Current Image Preview & Clear */}
        {currentImageUrl && (
          <div className="mb-4 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.3)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImageUrl}
                alt="Current"
                className="w-12 h-12 object-cover rounded-lg border border-[hsl(var(--border))] shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold block truncate">Current Image</span>
                <span className="text-[11px] text-[hsl(var(--muted-foreground))] block truncate font-mono-app">
                  {currentImageUrl.slice(0, 32)}...
                </span>
              </div>
            </div>
            {onImageRemoved && (
              <button
                onClick={() => {
                  onImageRemoved();
                  toast.success("Image removed. Clean card layout restored.");
                  onClose();
                }}
                className="text-xs text-red-500 hover:text-red-600 font-medium px-2.5 py-1 rounded-md hover:bg-red-500/10 shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {/* Drag and drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 mb-4 ${
            dragOver
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.05)]"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted)/.3)]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 size={28} className="animate-spin text-[hsl(var(--primary))]" />
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                Uploading image...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] flex items-center justify-center">
                <Upload size={18} />
              </div>
              <div>
                <span className="text-sm font-semibold block">Click to upload or drag & drop</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  PNG, JPG, WebP, SVG or AVIF (max 6MB)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Or direct URL form */}
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste direct image URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:outline-hidden focus:ring-1 focus:ring-[hsl(var(--primary))]"
          />
          <button
            type="submit"
            disabled={!customUrl.trim() || isUploading}
            className="px-3 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
          >
            <Check size={14} /> Apply
          </button>
        </form>
      </div>
    </div>
  );
}
