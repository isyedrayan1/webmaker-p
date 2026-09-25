"use client";

import React from "react";
import type {
  LandingPageData,
  SectionBlock,
  HeroVisualMode,
  LogoMode,
  HeroSectionData,
  NavbarSectionData,
  BookingSectionData,
  StatsSectionData,
  WhyUsSectionData,
  ServicesSectionData,
  DoctorsSectionData,
  ReviewsSectionData,
  HoursSectionData,
  FooterSectionData,
  StatItem,
  TrustPillar,
  ServiceItem,
  DoctorProfile,
  TestimonialItem,
  ScheduleDay,
} from "@/lib/builder-types";
import {
  SegmentedPicker,
  MicroToggle,
  ActionLinkChip,
  type SegmentedOption,
} from "./ControlPrimitives";
import {
  Sparkles,
  Image as ImageIcon,
  CreditCard,
  PhoneCall,
  ShieldCheck,
  FileText,
  EyeOff,
  Navigation,
  MapPin,
  Calendar,
  Layers,
  BarChart3,
  Stethoscope,
  Users,
  Star,
  Clock,
  PanelBottom,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface SectionInspectorProps {
  section: SectionBlock;
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  onOpenImageModal?: (targetField: string) => void;
}

export function SectionInspector({
  section,
  site,
  onChange,
  onOpenImageModal,
}: SectionInspectorProps) {
  const updateSectionData = (updatedData: Record<string, unknown>) => {
    const updatedSections = site.sections.map((sec) =>
      sec.id === section.id ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
    );
    onChange({ ...site, sections: updatedSections });
  };

  // 1. HERO SECTION INSPECTOR
  if (section.type === "hero") {
    const heroData = (section.data || {}) as Partial<HeroSectionData>;
    const currentMode: HeroVisualMode = heroData.visualMode || "image";

    const modeOptions: SegmentedOption<HeroVisualMode>[] = [
      { value: "image", label: "Hero Image", icon: ImageIcon },
      { value: "action_card", label: "Booking Card", icon: CreditCard },
      { value: "hotline_box", label: "Hotline Box", icon: PhoneCall },
      { value: "editorial", label: "Editorial", icon: FileText },
      { value: "none", label: "Text Only (No Media)", icon: EyeOff },
    ];

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Hero Section Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Configure visual slot modes, optional badge elements, and button actions.
          </p>
        </div>

        <SegmentedPicker<HeroVisualMode>
          label="Visual Slot Mode"
          options={modeOptions}
          value={currentMode}
          onChange={(newMode) => updateSectionData({ visualMode: newMode })}
        />

        {currentMode === "image" && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[hsl(var(--foreground))]">Hero Media Asset</span>
              <button
                type="button"
                onClick={() => onOpenImageModal && onOpenImageModal("hero.imageUrl")}
                className="text-[11px] font-medium text-[hsl(var(--primary))] hover:underline cursor-pointer"
              >
                Change Image
              </button>
            </div>
            {heroData.imageUrl ? (
              <div className="relative h-28 w-full overflow-hidden rounded-lg border border-[hsl(var(--border))]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroData.imageUrl}
                  alt="Hero asset preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
                No hero image set
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Optional Slots & Badges
          </label>
          <MicroToggle
            label="Top Announcement Badge"
            description="Display trust highlight badge above headline"
            checked={heroData.showBadge !== false}
            onChange={(checked) => updateSectionData({ showBadge: checked })}
            icon={ShieldCheck}
            badge="Slot"
          />
          <MicroToggle
            label="Secondary CTA Button"
            description="Display outline action button next to primary CTA"
            checked={heroData.showSecondaryCta !== false}
            onChange={(checked) => updateSectionData({ showSecondaryCta: checked })}
            icon={PhoneCall}
            badge="Slot"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Primary Button Action Target
          </label>
          <ActionLinkChip
            label={heroData.primaryCta || "Book Appointment"}
            actionType={site.buttonConfigs?.["hero.primaryCta"]?.actionType || "section"}
            target={site.buttonConfigs?.["hero.primaryCta"]?.target || "#booking"}
            variant={site.buttonConfigs?.["hero.primaryCta"]?.variant || "btn-primary"}
            openInNewTab={site.buttonConfigs?.["hero.primaryCta"]?.openInNewTab}
            onChange={(updated) => {
              updateSectionData({ primaryCta: updated.label });
              onChange({
                ...site,
                buttonConfigs: {
                  ...site.buttonConfigs,
                  "hero.primaryCta": updated,
                },
              });
            }}
          />
        </div>
      </div>
    );
  }

  // 2. NAVBAR SECTION INSPECTOR
  if (section.type === "navbar") {
    const navData = (section.data || {}) as Partial<NavbarSectionData>;
    const logoMode: LogoMode = navData.logoMode || "icon_text";

    const logoOptions: SegmentedOption<LogoMode>[] = [
      { value: "icon_text", label: "Icon + Text", icon: Navigation },
      { value: "text_only", label: "Text Only", icon: FileText },
      { value: "image", label: "Custom Logo", icon: ImageIcon },
      { value: "accent_split", label: "Accent Split", icon: Sparkles },
    ];

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Header Navigation Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Adjust logo layout modes and top emergency hotline bar.
          </p>
        </div>

        <SegmentedPicker<LogoMode>
          label="Logo Branding Mode"
          options={logoOptions}
          value={logoMode}
          onChange={(newMode) => updateSectionData({ logoMode: newMode })}
        />

        <div className="space-y-2">
          <MicroToggle
            label="Top Emergency Hotline Bar"
            description="Display 24/7 urgent call hotline top strip"
            checked={navData.showEmergencyTopBar !== false}
            onChange={(checked) => updateSectionData({ showEmergencyTopBar: checked })}
            icon={PhoneCall}
            badge="Top Strip"
          />
        </div>
      </div>
    );
  }

  // 3. PROOF METRICS (STATS) SECTION INSPECTOR
  if (section.type === "stats") {
    const statsData = (section.data || {}) as Partial<StatsSectionData>;
    const items = statsData.items || [];

    const handleAddItem = () => {
      const newItem: StatItem = {
        id: `stat_${Date.now()}`,
        value: "99%",
        label: "New Metric",
        subtext: "Verified metric data",
      };
      updateSectionData({ items: [...items, newItem] });
    };

    const handleRemoveItem = (id: string) => {
      updateSectionData({ items: items.filter((i) => i.id !== id) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Proof Metrics Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage metric cards. The layout automatically reflows based on card count.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Metric Cards ({items.length})
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Metric
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--primary))]">Metric #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Value</label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => {
                        const updated = items.map((i) => (i.id === item.id ? { ...i, value: e.target.value } : i));
                        updateSectionData({ items: updated });
                      }}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = items.map((i) => (i.id === item.id ? { ...i, label: e.target.value } : i));
                        updateSectionData({ items: updated });
                      }}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. CLINICAL SERVICES SECTION INSPECTOR
  if (section.type === "services") {
    const servicesData = (section.data || {}) as Partial<ServicesSectionData>;
    const services = servicesData.services || [];

    const handleAddService = () => {
      const newService: ServiceItem = {
        id: `srv_${Date.now()}`,
        iconName: "stethoscope",
        name: "New Medical Specialty",
        badge: "Specialist",
        description: "Comprehensive medical evaluation and treatment.",
        highlights: ["Diagnostic Testing", "Consultation"],
      };
      updateSectionData({ services: [...services, newService] });
    };

    const handleRemoveService = (id: string) => {
      updateSectionData({ services: services.filter((s) => s.id !== id) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Clinical Services Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage specialty cards and department highlights.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Specialty Cards ({services.length})
            </label>
            <button
              type="button"
              onClick={handleAddService}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Specialty
            </button>
          </div>

          <div className="space-y-2">
            {services.map((srv, idx) => (
              <div key={srv.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">{srv.name || `Specialty #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(srv.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Specialty Name</label>
                  <input
                    type="text"
                    value={srv.name}
                    onChange={(e) => {
                      const updated = services.map((s) => (s.id === srv.id ? { ...s, name: e.target.value } : s));
                      updateSectionData({ services: updated });
                    }}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. DOCTOR ROSTER SECTION INSPECTOR
  if (section.type === "doctors") {
    const doctorsData = (section.data || {}) as Partial<DoctorsSectionData>;
    const doctors = doctorsData.doctors || [];

    const handleAddDoctor = () => {
      const newDoc: DoctorProfile = {
        id: `doc_${Date.now()}`,
        name: "Dr. Alex Taylor, MD",
        role: "Specialist Physician",
        credentials: "MD, Board-Certified",
        experience: "10+ Years Experience",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      };
      updateSectionData({ doctors: [...doctors, newDoc] });
    };

    const handleRemoveDoctor = (id: string) => {
      updateSectionData({ doctors: doctors.filter((d) => d.id !== id) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Doctor Roster Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage physician profiles, credentials, and headshot assets.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Specialist Roster ({doctors.length})
            </label>
            <button
              type="button"
              onClick={handleAddDoctor}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Physician
            </button>
          </div>

          <div className="space-y-2">
            {doctors.map((doc, idx) => (
              <div key={doc.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoctor(doc.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Doctor Name</label>
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => {
                      const updated = doctors.map((d) => (d.id === doc.id ? { ...d, name: e.target.value } : d));
                      updateSectionData({ doctors: updated });
                    }}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 6. PATIENT REVIEWS SECTION INSPECTOR
  if (section.type === "reviews") {
    const reviewsData = (section.data || {}) as Partial<ReviewsSectionData>;
    const reviews = reviewsData.reviews || [];

    const handleAddReview = () => {
      const newReview: TestimonialItem = {
        id: `rev_${Date.now()}`,
        patientName: "Community Patient",
        treatment: "General Consultation",
        rating: 5,
        quote: "Exceptional clinical care and compassionate team.",
        date: "Verified Patient",
      };
      updateSectionData({ reviews: [...reviews, newReview] });
    };

    const handleRemoveReview = (id: string) => {
      updateSectionData({ reviews: reviews.filter((r) => r.id !== id) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Patient Reviews Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage patient testimonials and star rating displays.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Patient Reviews ({reviews.length})
            </label>
            <button
              type="button"
              onClick={handleAddReview}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Review
            </button>
          </div>

          <div className="space-y-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">{rev.patientName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReview(rev.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Patient Quote</label>
                  <textarea
                    rows={2}
                    value={rev.quote}
                    onChange={(e) => {
                      const updated = reviews.map((r) => (r.id === rev.id ? { ...r, quote: e.target.value } : r));
                      updateSectionData({ reviews: updated });
                    }}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 7. BOOKING & CONTACT SECTION INSPECTOR
  if (section.type === "booking") {
    const bookingData = (section.data || {}) as Partial<BookingSectionData>;

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Booking & Map Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Control Google Maps embed slots and fluid contact card layout reflow.
          </p>
        </div>

        <MicroToggle
          label="Google Maps Embed Slot"
          description="Display interactive Google Maps embed alongside booking form"
          checked={bookingData.showMap !== false}
          onChange={(checked) => updateSectionData({ showMap: checked })}
          icon={MapPin}
          badge="Map Reflow"
        />

        {bookingData.showMap !== false && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
            <label className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block">
              Google Maps Location Embed URL / Address Query
            </label>
            <input
              type="text"
              value={bookingData.mapEmbedUrl || ""}
              onChange={(e) => updateSectionData({ mapEmbedUrl: e.target.value })}
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          </div>
        )}
      </div>
    );
  }

  // 8. WHY CHOOSE US SECTION INSPECTOR
  if (section.type === "why_us") {
    const whyUsData = (section.data || {}) as Partial<WhyUsSectionData>;
    const pillars = whyUsData.pillars || [];

    const handleAddPillar = () => {
      const newPillar: TrustPillar = {
        id: `pil_${Date.now()}`,
        iconName: "shield",
        title: "New Trust Pillar",
        description: "High-quality care standards and patient commitment.",
      };
      updateSectionData({ pillars: [...pillars, newPillar] });
    };

    const handleRemovePillar = (id: string) => {
      updateSectionData({ pillars: pillars.filter((p) => p.id !== id) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Why Choose Us Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage trust pillars and care highlights.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Trust Pillars ({pillars.length})
            </label>
            <button
              type="button"
              onClick={handleAddPillar}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Pillar
            </button>
          </div>

          <div className="space-y-2">
            {pillars.map((pil, idx) => (
              <div key={pil.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">{pil.title || `Pillar #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePillar(pil.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Pillar Title</label>
                  <input
                    type="text"
                    value={pil.title}
                    onChange={(e) => {
                      const updated = pillars.map((p) => (p.id === pil.id ? { ...p, title: e.target.value } : p));
                      updateSectionData({ pillars: updated });
                    }}
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 9. OPERATING HOURS SECTION INSPECTOR
  if (section.type === "hours") {
    const hoursData = (section.data || {}) as Partial<HoursSectionData>;
    const schedule = hoursData.schedule || [];

    const handleAddSchedule = () => {
      const newDay: ScheduleDay = {
        day: "Saturday",
        hours: "9:00 AM – 4:00 PM",
      };
      updateSectionData({ schedule: [...schedule, newDay] });
    };

    const handleRemoveSchedule = (idx: number) => {
      updateSectionData({ schedule: schedule.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Operating Hours Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage weekly clinic operating schedule.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Schedule Days ({schedule.length})
            </label>
            <button
              type="button"
              onClick={handleAddSchedule}
              className="flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Day
            </button>
          </div>

          <div className="space-y-2">
            {schedule.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-1.5">
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">{item.day}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(idx)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Day</label>
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => {
                        const updated = schedule.map((s, i) => (i === idx ? { ...s, day: e.target.value } : s));
                        updateSectionData({ schedule: updated });
                      }}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">Hours</label>
                    <input
                      type="text"
                      value={item.hours}
                      onChange={(e) => {
                        const updated = schedule.map((s, i) => (i === idx ? { ...s, hours: e.target.value } : s));
                        updateSectionData({ schedule: updated });
                      }}
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. FOOTER SECTION INSPECTOR
  if (section.type === "footer") {
    const footerData = (section.data || {}) as Partial<FooterSectionData>;

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <PanelBottom size={14} className="text-[hsl(var(--primary))]" />
            <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
              Footer Inspector
            </h4>
          </div>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Manage hospital branding, accreditation badges, and medical disclaimers.
          </p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2">
          <label className="text-[10px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">
            Accreditation Badge Text
          </label>
          <input
            type="text"
            value={footerData.accreditationBadge || ""}
            onChange={(e) => updateSectionData({ accreditationBadge: e.target.value })}
            placeholder="e.g. JCAHO Accredited · State Certified"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs"
          />
        </div>
      </div>
    );
  }

  // DEFAULT / FALLBACK
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={14} className="text-[hsl(var(--primary))]" />
          <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
            {String(section.type).toUpperCase()} Inspector
          </h4>
        </div>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
          Edit text content directly on the studio canvas or use the Layers tab to reorder sections.
        </p>
      </div>
    </div>
  );
}
