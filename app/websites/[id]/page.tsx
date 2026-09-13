"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BuilderCanvas,
  type BuilderMode,
  type PreviewDevice,
} from "@/components/canvas/BuilderCanvas";
import { SectionNavigator } from "@/components/canvas/SectionNavigator";
import {
  ErrorState,
  Skeleton,
  StatusPill,
} from "@/components/factory-ui";
import {
  AlertCircle,
  ArrowLeft,
  Boxes,
  Check,
  ChevronDown,
  Cloud,
  Download,
  ExternalLink,
  Eye,
  FolderKanban,
  Globe,
  Globe2,
  Hash,
  Laptop,
  Layers,
  LayoutDashboard,
  Link as LinkIcon,
  Loader2,
  Mail,
  Palette,
  Pencil,
  Phone,
  Plus,
  Redo2,
  Rocket,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
  X,
  Image as ImageIcon,
  User,
} from "lucide-react";
import type { Website, WebsiteSummary } from "@/lib/types";
import { sampleContent } from "@/lib/data";
import {
  DEFAULT_CLINIC_DATA,
  THEME_PALETTES,
  type ButtonActionConfig,
  type LandingPageData,
  type SectionBlock,
  type ThemeColor,
  type LogoMode,
  type HeroVisualMode,
  type NavbarSectionData,
  type HeroSectionData,
  type DoctorsSectionData,
} from "@/lib/builder-types";
import { exportLandingPageAsZip } from "@/lib/zip-exporter";
import { ImageUploadModal } from "@/components/canvas/ImageUploadModal";
import { HeroVisualPicker, LogoModePicker } from "@/components/canvas/ContainerVisualPicker";
import { AssetManagerDrawer } from "@/components/canvas/AssetManagerDrawer";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { toast } from "sonner";

export type SyncStatus = "saved" | "unsaved" | "saving" | "error";

interface ConfigurableButtonMeta {
  id: string;
  defaultLabel: string;
  sectionName: string;
  defaultActionType: "section" | "url" | "phone" | "email";
  defaultTarget: string;
  defaultVariant: "btn-primary" | "btn-accent" | "btn-outline";
}

const PAGE_BUTTONS_REGISTRY: ConfigurableButtonMeta[] = [
  {
    id: "navbar.cta",
    defaultLabel: "Book Visit",
    sectionName: "Navigation Bar",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "hero.primaryCta",
    defaultLabel: "Book Appointment",
    sectionName: "Hero Header",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "hero.secondaryCta",
    defaultLabel: "Emergency Care",
    sectionName: "Hero Header",
    defaultActionType: "phone",
    defaultTarget: "+1 (800) 427-2673",
    defaultVariant: "btn-outline",
  },
  {
    id: "hero.cardCta",
    defaultLabel: "Confirm Time",
    sectionName: "Hero Appointment Card",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "services.cta",
    defaultLabel: "Consult a Specialist",
    sectionName: "Clinical Services",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "doctors.cta",
    defaultLabel: "View All 18 Specialists",
    sectionName: "Medical Staff",
    defaultActionType: "url",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "booking.submit",
    defaultLabel: "Submit Request",
    sectionName: "Direct Booking Form",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "footer.portal",
    defaultLabel: "Patient Portal Login",
    sectionName: "Footer",
    defaultActionType: "url",
    defaultTarget: "https://myhealth-portal.org",
    defaultVariant: "btn-primary",
  },
];

export default function WebsiteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [website, setWebsite] = useState<Website | null>(null);
  const [allWebsites, setAllWebsites] = useState<WebsiteSummary[]>([]);
  const router = useRouter();
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mode, setMode] = useState<BuilderMode>("edit");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "media" | "buttons" | "seo">("layout");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>("hero");

  // Media & Upload Modal State
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    target: "logo" | "hero" | { type: "doctor"; id: string };
    currentUrl?: string;
    title: string;
  }>({
    isOpen: false,
    target: "logo",
    title: "Upload Image",
  });

  // History State Engine (Real Undo & Redo)
  const [historyPast, setHistoryPast] = useState<LandingPageData[]>([]);
  const [historyFuture, setHistoryFuture] = useState<LandingPageData[]>([]);

  // Cloud Auto-Save Engine State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("just now");
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>("");
  const isInitialLoadRef = useRef(true);

  const handleNavigate = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (pageData && JSON.stringify(pageData) !== lastSavedStateRef.current) {
      await handleSaveSilent();
    }
    router.push(url);
  };

  // Dropdown states & refs for click-outside dismissal
  const [appNavOpen, setAppNavOpen] = useState(false);
  const [siteSwitcherOpen, setSiteSwitcherOpen] = useState(false);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const [buttonDropdownOpen, setButtonDropdownOpen] = useState(false);
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);

  const appNavRef = useRef<HTMLDivElement | null>(null);
  const siteSwitcherRef = useRef<HTMLDivElement | null>(null);
  const paletteDropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonDropdownRef = useRef<HTMLDivElement | null>(null);
  const publishDropdownRef = useRef<HTMLDivElement | null>(null);

  // Selected Button Inspector ID
  const [selectedButtonId, setSelectedButtonId] = useState<string>("hero.primaryCta");

  // Push state snapshot to history before user mutations
  const pushToHistory = (newData: LandingPageData) => {
    if (!pageData) return;
    setHistoryPast((prev) => [...prev.slice(-49), structuredClone(pageData)]);
    setHistoryFuture([]);
    setPageData(newData);
  };

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0 || !pageData) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, -1);
    setHistoryPast(newPast);
    setHistoryFuture((prev) => [structuredClone(pageData), ...prev]);
    setPageData(previous);
    toast.info("Undo: Reverted change", { duration: 1000 });
  }, [historyPast, pageData]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0 || !pageData) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    setHistoryFuture(newFuture);
    setHistoryPast((prev) => [...prev, structuredClone(pageData)]);
    setPageData(next);
    toast.info("Redo: Restored change", { duration: 1000 });
  }, [historyFuture, pageData]);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z, Cmd+Z, Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (!e.shiftKey) {
          if (!isInput) {
            e.preventDefault();
            handleUndo();
          }
        } else {
          if (!isInput) {
            e.preventDefault();
            handleRedo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data?.type === "CANVAS_SHORTCUT_UNDO") {
        handleUndo();
      } else if (event.data?.type === "CANVAS_SHORTCUT_REDO") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("message", handleWindowMessage);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("message", handleWindowMessage);
    };
  }, [handleUndo, handleRedo]);

  // Prevent accidental navigation when unsaved edits are present
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (syncStatus === "unsaved" || syncStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [syncStatus]);

  // Dismiss open dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        appNavRef.current &&
        !appNavRef.current.contains(event.target as Node)
      ) {
        setAppNavOpen(false);
      }
      if (
        siteSwitcherRef.current &&
        !siteSwitcherRef.current.contains(event.target as Node)
      ) {
        setSiteSwitcherOpen(false);
      }
      if (
        paletteDropdownRef.current &&
        !paletteDropdownRef.current.contains(event.target as Node)
      ) {
        setPaletteDropdownOpen(false);
      }
      if (
        buttonDropdownRef.current &&
        !buttonDropdownRef.current.contains(event.target as Node)
      ) {
        setButtonDropdownOpen(false);
      }
      if (
        publishDropdownRef.current &&
        !publishDropdownRef.current.contains(event.target as Node)
      ) {
        setPublishDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch website details and all websites list on mount
  useEffect(() => {
    let active = true;

    // 1. Fetch this website
    fetch(`/api/websites/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Website) => {
        if (!active) return;
        setWebsite(data);
        if (data.landingPageData) {
          setPageData(data.landingPageData);
          lastSavedStateRef.current = JSON.stringify(data.landingPageData);
        } else {
          const fallbackData: LandingPageData = structuredClone(DEFAULT_CLINIC_DATA);
          fallbackData.id = data.id;
          fallbackData.name = data.name;
          fallbackData.clientName = data.clientName;
          setPageData(fallbackData);
          lastSavedStateRef.current = JSON.stringify(fallbackData);
        }
        setSyncStatus("saved");
        isInitialLoadRef.current = false;
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        // Resilient Fallback: Auto-recover studio workspace for this site ID
        const decodedName =
          decodeURIComponent(id)
            .replace(/-[a-f0-9]{4,8}$/i, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) || "Custom Website";

        const fallbackPageData: LandingPageData = structuredClone(DEFAULT_CLINIC_DATA);
        fallbackPageData.id = id;
        fallbackPageData.name = decodedName;
        fallbackPageData.clientName = `${decodedName} Client`;

        const fallbackWebsite: Website = {
          id,
          userId: "usr_dev_workspace",
          name: decodedName,
          clientName: `${decodedName} Client`,
          templateId: "care-standard",
          templateName: "Care Standard Hospital",
          status: "draft",
          updatedAt: new Date().toISOString(),
          domain: null,
          previewUrl: null,
          draft: structuredClone(sampleContent),
          published: null,
          approvedAt: null,
          publishedAt: null,
          deploymentId: null,
          hostingerUid: null,
          landingPageData: fallbackPageData,
        };

        setWebsite(fallbackWebsite);
        setPageData(fallbackPageData);
        lastSavedStateRef.current = JSON.stringify(fallbackPageData);
        setSyncStatus("saved");
        isInitialLoadRef.current = false;
        setLoading(false);
      });

    // 2. Fetch all websites for quick switcher dropdown
    fetch("/api/websites")
      .then((res) => res.ok && res.json())
      .then((sites: WebsiteSummary[]) => {
        if (active && Array.isArray(sites)) {
          setAllWebsites(sites);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [id]);

  // Debounced Auto-Save Engine (800ms idle timer, fast & responsive)
  useEffect(() => {
    if (isInitialLoadRef.current || !pageData) return;

    const currentStr = JSON.stringify(pageData);
    if (currentStr === lastSavedStateRef.current) {
      return; // No differences from saved state
    }

    // Mark as unsaved immediately
    setSyncStatus("unsaved");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Trigger background auto-save after 600ms of user idle
    autoSaveTimerRef.current = setTimeout(async () => {
      setSyncStatus("saving");
      try {
        const res = await fetch(`/api/websites/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ landingPageData: pageData }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Auto-save failed with status ${res.status}`);
        }
        const updated = await res.json();
        setWebsite(updated);
        lastSavedStateRef.current = currentStr;
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
        setSyncStatus("saved");
      } catch (err) {
        console.error("Auto-save error:", err);
        setSyncStatus("error");
      }
    }, 600);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [pageData, id]);

  // Listen for button selection clicks directly from inside the iframe canvas
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "CANVAS_BUTTON_SELECT") {
        const { buttonId, label } = event.data;
        if (buttonId) {
          setSelectedButtonId(buttonId);
          setShowToolsPanel(true);
          setActiveTab("buttons");
          toast.info(`Editing button: "${label || buttonId}"`, { duration: 1800 });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSaveSilent = async () => {
    if (!pageData) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setSyncStatus("saving");
    try {
      const res = await fetch(`/api/websites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landingPageData: pageData }),
      });
      if (res.ok) {
        const updated = await res.json();
        setWebsite(updated);
        lastSavedStateRef.current = JSON.stringify(pageData);
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
        setSyncStatus("saved");
      }
    } catch {
      setSyncStatus("error");
    }
  };

  const handleSave = async () => {
    if (!pageData) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setSaving(true);
    setSyncStatus("saving");
    try {
      const res = await fetch(`/api/websites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landingPageData: pageData }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setWebsite(updated);
      lastSavedStateRef.current = JSON.stringify(pageData);
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setSyncStatus("saved");
      toast.success("Draft saved successfully & synced!");
    } catch {
      setSyncStatus("error");
      toast.error("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!pageData) return;
    setExporting(true);
    try {
      await exportLandingPageAsZip(pageData);
      toast.success("dist.zip generated and downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate zip bundle.");
    } finally {
      setExporting(false);
    }
  };

  const handlePublish = async () => {
    if (!pageData) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/websites/${id}/publish`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Deploy failed");
      const result = await res.json();
      setWebsite(result.website);
      const url = result.deployment?.url || `/api/websites/${id}/preview`;
      toast.success("Website published successfully! Your live website is active.", {
        action: {
          label: "View Site",
          onClick: () => window.open(url, "_blank"),
        },
      });
    } catch {
      toast.error("Failed to publish website. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleReorderSections = (newSections: SectionBlock[]) => {
    if (!pageData) return;
    pushToHistory({ ...pageData, sections: newSections });
  };

  const handleToggleSection = (sectionId: string) => {
    if (!pageData) return;
    const updated = pageData.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
    );
    pushToHistory({ ...pageData, sections: updated });
  };

  const handleScrollToSection = (sectionId: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: "SCROLL_TO_SECTION",
          sectionId,
        },
        "*"
      );
    }
  };

  const handleThemeChange = (theme: ThemeColor) => {
    if (!pageData) return;
    pushToHistory({ ...pageData, theme });
    setPaletteDropdownOpen(false);
    toast.info(`Theme set to ${THEME_PALETTES[theme].name}`);
  };

  // Comprehensive Button Configuration Updater with History
  const handleUpdateButtonConfig = (
    buttonId: string,
    updates: Partial<ButtonActionConfig>
  ) => {
    if (!pageData) return;
    const existing = pageData.buttonConfigs?.[buttonId] || {
      actionType: "section",
      target: "#booking",
      variant: "btn-primary",
      openInNewTab: false,
    };

    const newConfig: ButtonActionConfig = { ...existing, ...updates };
    const updatedConfigs = { ...(pageData.buttonConfigs || {}), [buttonId]: newConfig };

    pushToHistory({ ...pageData, buttonConfigs: updatedConfigs });
  };

  // SEO updates with History
  const handleSeoChange = (key: "title" | "description", val: string) => {
    if (!pageData) return;
    const currentSeo = pageData.seo || {};
    pushToHistory({ ...pageData, seo: { ...currentSeo, [key]: val } });
  };

  // Visual Media & Logo Handlers
  const handleUpdateNavbarLogo = (logoMode: LogoMode, logoUrl?: string, accentWord?: string) => {
    if (!pageData) return;
    const resolvedLogoType: "icon_text" | "image" | "text_only" =
      logoMode === "image" ? "image" : logoMode === "text_only" ? "text_only" : "icon_text";

    const updatedSections = pageData.sections.map((sec) => {
      if (sec.type === "navbar") {
        return {
          ...sec,
          data: {
            ...sec.data,
            logoMode,
            logoType: resolvedLogoType,
            ...(logoUrl !== undefined ? { logoUrl } : {}),
            ...(accentWord !== undefined ? { accentWord } : {}),
          },
        };
      }
      return sec;
    });
    pushToHistory({ ...pageData, sections: updatedSections });
  };

  const handleUpdateHeroVisual = (visualMode: HeroVisualMode, imageUrl?: string) => {
    if (!pageData) return;
    const updatedSections = pageData.sections.map((sec) => {
      if (sec.type === "hero") {
        return {
          ...sec,
          data: {
            ...sec.data,
            visualMode,
            ...(imageUrl !== undefined ? { imageUrl } : {}),
          },
        };
      }
      return sec;
    });
    pushToHistory({ ...pageData, sections: updatedSections });
  };

  const handleUpdateDoctorImage = (docId: string, imageUrl?: string) => {
    if (!pageData) return;
    const updatedSections = pageData.sections.map((sec) => {
      if (sec.type === "doctors" && "doctors" in sec.data && Array.isArray(sec.data.doctors)) {
        const updatedDoctors = sec.data.doctors.map((doc) => {
          if (doc.id === docId) {
            return { ...doc, imageUrl: imageUrl || undefined };
          }
          return doc;
        });
        return { ...sec, data: { ...sec.data, doctors: updatedDoctors } };
      }
      return sec;
    });
    pushToHistory({ ...pageData, sections: updatedSections });
  };

  const handleLoadStockPreset = () => {
    if (!pageData) return;
    const stockHero = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80";
    const stockDocs = [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1594824813589-39744c8dc644?auto=format&fit=crop&w=600&q=80",
    ];

    const updated = pageData.sections.map((sec) => {
      if (sec.type === "hero") {
        return {
          ...sec,
          data: { ...sec.data, visualMode: "image" as HeroVisualMode, imageUrl: stockHero },
        };
      }
      if (sec.type === "doctors" && "doctors" in sec.data && Array.isArray(sec.data.doctors)) {
        const docs = sec.data.doctors.map((doc, idx) => ({
          ...doc,
          imageUrl: stockDocs[idx % stockDocs.length],
        }));
        return { ...sec, data: { ...sec.data, doctors: docs } };
      }
      return sec;
    });

    pushToHistory({ ...pageData, sections: updated });
    toast.success("Loaded demo medical photography!");
  };

  const handleClearAllImages = () => {
    if (!pageData) return;
    const updated = pageData.sections.map((sec) => {
      if (sec.type === "navbar") {
        return {
          ...sec,
          data: {
            ...sec.data,
            logoMode: "icon_text" as LogoMode,
            logoType: "icon_text" as const,
            logoUrl: undefined,
          },
        };
      }
      if (sec.type === "hero") {
        return {
          ...sec,
          data: { ...sec.data, visualMode: "action_card" as HeroVisualMode, imageUrl: undefined },
        };
      }
      if (sec.type === "doctors" && "doctors" in sec.data && Array.isArray(sec.data.doctors)) {
        const docs = sec.data.doctors.map((doc) => ({
          ...doc,
          imageUrl: undefined,
        }));
        return { ...sec, data: { ...sec.data, doctors: docs } };
      }
      if (sec.type === "services" && "services" in sec.data && Array.isArray(sec.data.services)) {
        const srvs = sec.data.services.map((srv) => ({
          ...srv,
          imageUrl: undefined,
        }));
        return { ...sec, data: { ...sec.data, services: srvs } };
      }
      return sec;
    });

    pushToHistory({ ...pageData, sections: updated });
    toast.success("Zero-image text mode applied. All cards reset cleanly!");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[hsl(var(--background))] gap-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 w-80 rounded-2xl" />
      </div>
    );
  }

  if (!website || !pageData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[hsl(var(--background))] p-6">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const activeTheme = THEME_PALETTES[pageData.theme] || THEME_PALETTES.emerald;

  // Selected button details
  const activeBtnMeta =
    PAGE_BUTTONS_REGISTRY.find((b) => b.id === selectedButtonId) ||
    PAGE_BUTTONS_REGISTRY[0];

  const currentBtnConfig: ButtonActionConfig = pageData.buttonConfigs?.[
    activeBtnMeta.id
  ] || {
    label: activeBtnMeta.defaultLabel,
    actionType: activeBtnMeta.defaultActionType,
    target: activeBtnMeta.defaultTarget,
    variant: activeBtnMeta.defaultVariant,
    openInNewTab: false,
  };

  // Consolidated Publish & Export Dropdown Element
  const renderPublishDropdown = () => (
    <div ref={publishDropdownRef} className="relative z-50">
      <button
        onClick={() => setPublishDropdownOpen(!publishDropdownOpen)}
        disabled={publishing || exporting}
        className="flex h-9 items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] text-white text-xs font-semibold px-3.5 shadow-xs hover:opacity-95 transition cursor-pointer disabled:opacity-50"
        title="Publish or export website"
      >
        {publishing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Publishing...</span>
          </>
        ) : exporting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Rocket size={14} />
            <span>Publish</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-150 ${
                publishDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {publishDropdownOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-2xl space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-[hsl(var(--border))]">
            <div className="text-[10px] font-mono-app uppercase font-semibold text-[hsl(var(--muted-foreground))]">
              Deployment &amp; Export
            </div>
            <div className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">
              {website.domain || `${website.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.health`}
            </div>
          </div>

          {/* Option 1: Live Hostinger Publish */}
          <button
            onClick={() => {
              setPublishDropdownOpen(false);
              handlePublish();
            }}
            disabled={publishing}
            className="w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left hover:bg-[hsl(var(--primary)/.08)] transition cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-white shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Rocket size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]">
                  Publish Live Website
                </span>
                <span className="text-[9px] font-mono-app px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-tight mt-0.5">
                Deploy and activate your website with an instant public preview.
              </p>
            </div>
          </button>

          {/* Option 2: Download Static ZIP */}
          <button
            onClick={() => {
              setPublishDropdownOpen(false);
              handleDownloadZip();
            }}
            disabled={exporting}
            className="w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left hover:bg-[hsl(var(--muted))] transition cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--primary))] shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Download size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[hsl(var(--foreground))]">
                  Download dist.zip
                </span>
                <span className="text-[9px] font-mono-app px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                  Static HTML
                </span>
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-tight mt-0.5">
                Download clean HTML, CSS &amp; JS assets ready for any host.
              </p>
            </div>
          </button>

          {/* Option 3: View Live Preview */}
          <a
            href={`/api/websites/${id}/preview`}
            target="_blank"
            rel="noreferrer"
            onClick={async () => {
              setPublishDropdownOpen(false);
              await handleSaveSilent();
            }}
            className="w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left hover:bg-[hsl(var(--muted))] transition cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] shadow-2xs shrink-0 group-hover:text-[hsl(var(--foreground))]">
              <ExternalLink size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[hsl(var(--foreground))]">
                  Open in New Tab
                </span>
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-tight mt-0.5">
                Launch standalone full-screen web preview.
              </p>
            </div>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Global Transparent Backdrop: Closes open dropdowns on ANY click anywhere on screen/canvas */}
      {(paletteDropdownOpen ||
        buttonDropdownOpen ||
        publishDropdownOpen ||
        siteSwitcherOpen ||
        appNavOpen) && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setAppNavOpen(false);
            setSiteSwitcherOpen(false);
            setPaletteDropdownOpen(false);
            setButtonDropdownOpen(false);
            setPublishDropdownOpen(false);
          }}
        />
      )}

      {/* Studio Header */}
      <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] px-4 backdrop-blur-md sm:px-6">
        {mode === "edit" ? (
          /* ================= EDIT MODE TOOLBAR ================= */
          <>
            {/* Left: Back Button & Product Navigation Dropdown */}
            <div className="flex items-center gap-3">
              {/* Split Back & App Switcher Pill */}
              <div ref={appNavRef} className="relative z-50 flex h-9 items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xs">
                <Link
                  data-testid="link-back-websites"
                  href="/websites"
                  onClick={(e) => handleNavigate(e, "/websites")}
                  className="flex h-9 w-9 items-center justify-center rounded-l-xl text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Back to Websites Dashboard"
                >
                  <ArrowLeft size={15} />
                </Link>
                <div className="h-4 w-px bg-[hsl(var(--border))]" />
                <button
                  onClick={() => setAppNavOpen(!appNavOpen)}
                  className="flex h-9 px-2 items-center justify-center rounded-r-xl text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer"
                  title="Open Webmaker App Menu (Templates, Deployments, Settings, etc.)"
                >
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-150 ${
                      appNavOpen ? "rotate-180 text-[hsl(var(--primary))]" : ""
                    }`}
                  />
                </button>

                {/* Product-Level Navigation Dropdown Popover */}
                {appNavOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-2xl space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
                      <span className="text-[10px] font-mono-app uppercase font-semibold text-[hsl(var(--muted-foreground))]">
                        Webmaker Navigation
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/websites"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/websites");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <Globe2 size={15} className="text-[hsl(var(--primary))]" />
                        <span>Websites</span>
                      </Link>
                      <Link
                        href="/templates"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/templates");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <Boxes size={15} className="text-amber-500" />
                        <span>Templates</span>
                      </Link>
                      <Link
                        href="/deployments"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/deployments");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <Rocket size={15} className="text-emerald-500" />
                        <span>Deployments</span>
                      </Link>
                      <Link
                        href="/domains"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/domains");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <ShieldCheck size={15} className="text-blue-500" />
                        <span>Domains</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/settings");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <Settings2 size={15} className="text-purple-500" />
                        <span>Settings</span>
                      </Link>
                      <div className="my-1 border-t border-[hsl(var(--border))]" />
                      <Link
                        href="/"
                        onClick={(e) => {
                          setAppNavOpen(false);
                          handleNavigate(e, "/");
                        }}
                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition"
                      >
                        <LayoutDashboard size={15} />
                        <span>Overview</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Website Switcher Dropdown Trigger */}
              <div ref={siteSwitcherRef} className="relative z-50">
                <button
                  onClick={() => setSiteSwitcherOpen(!siteSwitcherOpen)}
                  className="flex flex-col items-start rounded-xl px-2 py-1 -mx-2 hover:bg-[hsl(var(--muted))] transition cursor-pointer text-left group"
                  title="Switch to another website project"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono-app text-[9px] font-semibold uppercase tracking-wider text-[hsl(var(--primary))]">
                      Website Builder
                    </span>
                    <StatusPill status={website.status} />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 max-w-[180px] sm:max-w-xs">
                    <h1 className="font-display text-lg sm:text-xl font-bold leading-none text-[hsl(var(--foreground))] truncate">
                      {pageData.name}
                    </h1>
                    <ChevronDown
                      size={14}
                      className={`text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-transform duration-150 shrink-0 ${
                        siteSwitcherOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Website Switcher Popover Menu */}
                {siteSwitcherOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-2xl space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
                      <span className="text-[10px] font-mono-app uppercase font-semibold text-[hsl(var(--muted-foreground))]">
                        Switch Website
                      </span>
                      <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">
                        {allWebsites.length} Projects
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 custom-scrollbar">
                      {allWebsites.map((site) => {
                        const isCurrent = site.id === id;
                        return (
                          <Link
                            key={site.id}
                            href={`/websites/${site.id}`}
                            onClick={(e) => {
                              setSiteSwitcherOpen(false);
                              handleNavigate(e, `/websites/${site.id}`);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl p-2.5 text-xs transition text-left ${
                              isCurrent
                                ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                                : "hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                            }`}
                          >
                            <div className="min-w-0 truncate pr-2">
                              <span className="block truncate font-semibold">{site.name}</span>
                              <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app block truncate">
                                {site.clientName} • {site.templateName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <StatusPill status={site.status} />
                              {isCurrent && <Check size={13} className="text-[hsl(var(--primary))]" />}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-[hsl(var(--border))] pt-1.5 mt-1 space-y-1">
                      <Link
                        href="/websites/new"
                        onClick={(e) => {
                          setSiteSwitcherOpen(false);
                          handleNavigate(e, "/websites/new");
                        }}
                        className="w-full flex items-center gap-2 rounded-xl p-2 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.08)] transition"
                      >
                        <Plus size={14} />
                        <span>+ Create New Website</span>
                      </Link>
                      <Link
                        href="/websites"
                        onClick={(e) => {
                          setSiteSwitcherOpen(false);
                          handleNavigate(e, "/websites");
                        }}
                        className="w-full flex items-center gap-2 rounded-xl p-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
                      >
                        <FolderKanban size={14} />
                        <span>View All Websites</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Undo/Redo & Canvas Active Badge */}
            <div className="flex items-center gap-2">
              {/* Working Undo / Redo Cluster */}
              <div className="flex h-9 items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-2xs">
                <button
                  onClick={handleUndo}
                  disabled={historyPast.length === 0}
                  title="Undo (Ctrl + Z / ⌘ + Z)"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-25 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <Undo2 size={14} />
                </button>
                <div className="h-3.5 w-px bg-[hsl(var(--border))] mx-0.5" />
                <button
                  onClick={handleRedo}
                  disabled={historyFuture.length === 0}
                  title="Redo (Ctrl + Y / ⌘ + Shift + Z)"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-25 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <Redo2 size={14} />
                </button>
              </div>

              {/* Edit Mode Indicator */}
              <div className="hidden md:flex h-9 items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-xs text-[hsl(var(--foreground))] shadow-2xs">
                <Pencil size={13} className="text-[hsl(var(--primary))]" />
                <span className="font-semibold text-xs">Edit Mode</span>
              </div>
            </div>

            {/* Right: Actions Cluster (Status + Customize + Save + Preview + Publish) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Interactive Cloud Auto-Save Status Pill */}
              <button
                onClick={handleSave}
                disabled={saving || syncStatus === "saving"}
                title={
                  syncStatus === "saved"
                    ? `All changes saved to cloud (${lastSavedTime}). Click to force sync now.`
                    : syncStatus === "unsaved"
                    ? "Unsaved edits detected. Auto-saving in a moment... (Click to save immediately)"
                    : syncStatus === "saving"
                    ? "Saving changes to cloud in real time..."
                    : "Sync error. Click to retry saving."
                }
                className={`flex h-9 items-center gap-1.5 px-3 rounded-full border text-xs font-mono-app shadow-2xs transition-all duration-200 cursor-pointer select-none group ${
                  syncStatus === "saved"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                    : syncStatus === "unsaved"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/60 shadow-amber-500/5"
                    : syncStatus === "saving"
                    ? "border-[hsl(var(--primary)/.4)] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                }`}
              >
                {syncStatus === "saved" && (
                  <>
                    <Cloud size={14} className="text-emerald-500 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Saved</span>
                  </>
                )}
                {syncStatus === "unsaved" && (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Unsaved</span>
                  </>
                )}
                {syncStatus === "saving" && (
                  <>
                    <Loader2 size={14} className="animate-spin text-[hsl(var(--primary))] shrink-0" />
                    <span className="font-semibold text-[hsl(var(--primary))]">Saving...</span>
                  </>
                )}
                {syncStatus === "error" && (
                  <>
                    <AlertCircle size={14} className="text-rose-500 shrink-0" />
                    <span className="font-semibold text-rose-500">Retry Sync</span>
                  </>
                )}
              </button>

              {/* Media Vault Button */}
              <button
                onClick={() => {
                  setShowAssetDrawer(!showAssetDrawer);
                  if (showToolsPanel) setShowToolsPanel(false);
                }}
                className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                  showAssetDrawer
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                }`}
                title="Open Media Library"
              >
                <ImageIcon size={14} className="text-[hsl(var(--primary))]" />
                <span className="hidden sm:inline">Media</span>
                {pageData?.assets?.uploadedAssets && pageData.assets.uploadedAssets.length > 0 && (
                  <span className="rounded-full bg-[hsl(var(--primary))] text-white text-[9px] px-1.5 py-0.2 font-mono-app">
                    {pageData.assets.uploadedAssets.length}
                  </span>
                )}
              </button>

              {/* Customize Slide-Over Button */}
              <button
                onClick={() => {
                  setShowToolsPanel(!showToolsPanel);
                  if (showAssetDrawer) setShowAssetDrawer(false);
                }}
                className={`flex h-9 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                  showToolsPanel
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                }`}
                title="Customize Theme, Media, Buttons, and SEO"
              >
                <Layers size={14} />
                <span className="hidden sm:inline">Customize</span>
              </button>

              {/* Save Draft Button */}
              <button
                onClick={handleSave}
                disabled={saving || syncStatus === "saving"}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 text-xs font-semibold shadow-2xs hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] transition cursor-pointer disabled:opacity-50"
                title="Save changes manually"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span className="hidden sm:inline">Save</span>
              </button>

              {/* Enter Interactive Device Preview Mode */}
              <button
                onClick={async () => {
                  await handleSaveSilent();
                  setMode("preview");
                }}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 text-xs font-semibold text-[hsl(var(--foreground))] shadow-2xs hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition cursor-pointer"
                title="Test responsive layouts on Desktop, Tablet, and Mobile"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Preview</span>
              </button>

              {/* Consolidated Publish & Export Dropdown */}
              {renderPublishDropdown()}
            </div>
          </>
        ) : (
          /* ================= PREVIEW MODE TOOLBAR ================= */
          <>
            {/* Left: Exit Preview Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode("edit")}
                className="flex h-9 items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft size={15} />
                <span>Back to Editor</span>
              </button>
            </div>

            {/* Center: Device Simulator Selector */}
            <div className="flex h-9 items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-2xs">
              <button
                onClick={() => setPreviewDevice("desktop")}
                title="Canonical Desktop (1280px)"
                className={`flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer transition ${
                  previewDevice === "desktop"
                    ? "bg-[hsl(var(--primary))] text-white shadow-xs"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <Laptop size={14} />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                title="Tablet (768px iPad)"
                className={`flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer transition ${
                  previewDevice === "tablet"
                    ? "bg-[hsl(var(--primary))] text-white shadow-xs"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <Tablet size={14} />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                title="Mobile (390px iPhone / Android)"
                className={`flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer transition ${
                  previewDevice === "mobile"
                    ? "bg-[hsl(var(--primary))] text-white shadow-xs"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Right: Consolidated Publish & Export Dropdown */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {renderPublishDropdown()}
            </div>
          </>
        )}
      </header>

      {/* Main Studio Viewport */}
      <main className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-row">
        {/* Full-width 100% Canvas Workspace */}
        <div className="flex-1 h-full w-full min-w-0 relative overflow-hidden">
          <BuilderCanvas
            site={pageData}
            onChange={pushToHistory}
            mode={mode}
            previewDevice={previewDevice}
            onUndo={handleUndo}
            onTypingActive={() => setSyncStatus("unsaved")}
          />
        </div>

        {/* ================= FRAMER-STYLE CUSTOMIZE SLIDE-OVER DRAWER ================= */}
        {showToolsPanel && mode === "edit" && pageData && (
          <aside className="fixed inset-y-0 right-0 top-16 z-50 w-full max-w-sm border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-200">
            <InspectorPanel
              site={pageData}
              onChange={pushToHistory}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onScrollToSection={handleScrollToSection}
              onClose={() => setShowToolsPanel(false)}
              onOpenImageModal={(targetField) => {
                const targetObj = targetField === "logoUrl" ? "logo" : "hero";
                const navData = pageData.sections.find((s) => s.type === "navbar")?.data as NavbarSectionData | undefined;
                const heroData = pageData.sections.find((s) => s.type === "hero")?.data as HeroSectionData | undefined;
                setUploadModal({
                  isOpen: true,
                  target: targetObj,
                  title: `Upload ${targetField}`,
                  currentUrl: targetField === "logoUrl" ? navData?.logoUrl : heroData?.imageUrl,
                });
              }}
            />
          </aside>
        )}

        {/* ================= CLOUDFLARE R2 MEDIA VAULT DRAWER ================= */}
        {pageData && (
          <AssetManagerDrawer
            isOpen={showAssetDrawer && mode === "edit"}
            onClose={() => setShowAssetDrawer(false)}
            site={pageData}
            onChange={(updated) => pushToHistory(updated)}
          />
        )}
      </main>

      {/* Image Upload & Media Modal */}
      <ImageUploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={uploadModal.currentUrl}
        title={uploadModal.title}
        siteId={website?.id || id}
        onImageSelected={(url) => {
          if (uploadModal.target === "logo") {
            const nav = pageData?.sections.find((s) => s.type === "navbar");
            const navData = (nav?.data || {}) as NavbarSectionData;
            handleUpdateNavbarLogo("image", url, navData.accentWord);
          } else if (uploadModal.target === "hero") {
            handleUpdateHeroVisual("image", url);
          } else if (typeof uploadModal.target === "object" && uploadModal.target.type === "doctor") {
            handleUpdateDoctorImage(uploadModal.target.id, url);
          }
        }}
        onImageRemoved={() => {
          if (uploadModal.target === "logo") {
            const nav = pageData?.sections.find((s) => s.type === "navbar");
            const navData = (nav?.data || {}) as NavbarSectionData;
            handleUpdateNavbarLogo("icon_text", undefined, navData.accentWord);
          } else if (uploadModal.target === "hero") {
            handleUpdateHeroVisual("action_card", undefined);
          } else if (typeof uploadModal.target === "object" && uploadModal.target.type === "doctor") {
            handleUpdateDoctorImage(uploadModal.target.id, undefined);
          }
        }}
      />
    </div>
  );
}
