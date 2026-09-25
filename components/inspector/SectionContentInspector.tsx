"use client";

import React, { useState } from "react";
import type {
  LandingPageData,
  SectionBlock,
  HeroSectionData,
  HeroVisualMode,
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
  LogoMode,
} from "@/lib/builder-types";
import {
  ActionLinkChip,
  ImageSlotControl,
  MicroToggle,
  SegmentedPicker,
  type SegmentedOption,
  TextAreaField,
  TextField,
} from "./ControlPrimitives";
import {
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  CreditCard,
  PhoneCall,
  ShieldCheck,
  FileText,
  EyeOff,
  Navigation,
  Image as ImageIcon,
  Star,
  Users,
  Stethoscope,
  Clock,
  Calendar,
  Layers,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

interface SectionContentInspectorProps {
  section: SectionBlock;
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  onOpenImageModal?: (targetField: string) => void;
}

export function SectionContentInspector({
  section,
  site,
  onChange,
  onOpenImageModal,
}: SectionContentInspectorProps) {
  // Collapsed states for repeating items
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const updateSectionData = (updatedData: Record<string, unknown>) => {
    const updatedSections = site.sections.map((sec) =>
      sec.id === section.id ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
    );
    onChange({ ...site, sections: updatedSections });
  };

  // ==========================================
  // 1. HERO SECTION CONTENT
  // ==========================================
  if (section.type === "hero") {
    const hero = (section.data || {}) as Partial<HeroSectionData>;
    const visualMode: HeroVisualMode = hero.visualMode || "image";

    const modeOptions: SegmentedOption<HeroVisualMode>[] = [
      { value: "image", label: "Hero Photo", icon: ImageIcon },
      { value: "action_card", label: "Booking Card", icon: CreditCard },
      { value: "hotline_box", label: "Hotline Box", icon: PhoneCall },
      { value: "editorial", label: "Editorial", icon: FileText },
      { value: "none", label: "Text Only", icon: EyeOff },
    ];

    return (
      <div className="space-y-4 p-4">
        {/* Header copy */}
        <div className="space-y-3">
          <MicroToggle
            label="Announcement Badge"
            description="Display trust pill above main headline"
            checked={hero.showBadge !== false}
            onChange={(checked) => updateSectionData({ showBadge: checked })}
            icon={ShieldCheck}
            badge="Slot"
          />

          {hero.showBadge !== false && (
            <TextField
              label="Badge Text"
              value={hero.badge || ""}
              onChange={(val) => updateSectionData({ badge: val })}
              placeholder="e.g. #1 Rated Healthcare Clinic"
              maxLength={45}
            />
          )}

          <TextField
            label="Main Headline"
            value={hero.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="e.g. Comprehensive Care Close to Home"
            maxLength={80}
            helpText="Keep within 80 characters for optimal desktop & mobile presentation."
          />

          <TextAreaField
            label="Subheadline / Description"
            value={hero.subheadline || ""}
            onChange={(val) => updateSectionData({ subheadline: val })}
            placeholder="e.g. Compassionate, high-precision medical care backed by board-certified specialists."
            maxLength={240}
            rows={3}
          />

          <TextField
            label="Trust Snippet (Footnote)"
            value={hero.trustSnippet || ""}
            onChange={(val) => updateSectionData({ trustSnippet: val })}
            placeholder="e.g. Accepting all major insurance providers · Same-day walk-ins"
            maxLength={80}
          />
        </div>

        {/* Buttons Routing */}
        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Call to Action Buttons
          </label>

          <ActionLinkChip
            label={hero.primaryCta || "Book Appointment"}
            actionType={site.buttonConfigs?.["hero.primaryCta"]?.actionType || "section"}
            target={site.buttonConfigs?.["hero.primaryCta"]?.target || "#booking"}
            variant={site.buttonConfigs?.["hero.primaryCta"]?.variant || "btn-primary"}
            openInNewTab={site.buttonConfigs?.["hero.primaryCta"]?.openInNewTab}
            onChange={(updated) => {
              updateSectionData({ primaryCta: updated.label });
              onChange({
                ...site,
                buttonConfigs: { ...site.buttonConfigs, "hero.primaryCta": updated },
              });
            }}
          />

          <MicroToggle
            label="Secondary CTA Button"
            description="Display outline action next to primary button"
            checked={hero.showSecondaryCta !== false}
            onChange={(checked) => updateSectionData({ showSecondaryCta: checked })}
            icon={PhoneCall}
            badge="Optional"
          />

          {hero.showSecondaryCta !== false && (
            <ActionLinkChip
              label={hero.secondaryCta || "Emergency 24/7"}
              actionType={site.buttonConfigs?.["hero.secondaryCta"]?.actionType || "phone"}
              target={site.buttonConfigs?.["hero.secondaryCta"]?.target || "+1 (800) 555-0199"}
              variant={site.buttonConfigs?.["hero.secondaryCta"]?.variant || "btn-outline"}
              openInNewTab={site.buttonConfigs?.["hero.secondaryCta"]?.openInNewTab}
              onChange={(updated) => {
                updateSectionData({ secondaryCta: updated.label });
                onChange({
                  ...site,
                  buttonConfigs: { ...site.buttonConfigs, "hero.secondaryCta": updated },
                });
              }}
            />
          )}
        </div>

        {/* Visual Media Slot */}
        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <SegmentedPicker<HeroVisualMode>
            label="Hero Visual Slot"
            options={modeOptions}
            value={visualMode}
            onChange={(m) => updateSectionData({ visualMode: m })}
          />

          {visualMode === "image" && (
            <ImageSlotControl
              label="Hero Photography"
              imageUrl={hero.imageUrl}
              aspectRatio="4:3"
              onOpenModal={() => onOpenImageModal && onOpenImageModal("hero.imageUrl")}
              onRemove={() => updateSectionData({ imageUrl: undefined })}
            />
          )}

          {visualMode === "action_card" && (
            <div className="space-y-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <span className="text-xs font-semibold text-[hsl(var(--foreground))] block">
                Booking Lead Card Copy
              </span>
              <TextField
                label="Card Title"
                value={hero.cardTitle || ""}
                onChange={(val) => updateSectionData({ cardTitle: val })}
                placeholder="Care When You Need It"
                maxLength={45}
              />
              <TextAreaField
                label="Card Body"
                value={hero.cardBody || ""}
                onChange={(val) => updateSectionData({ cardBody: val })}
                placeholder="Same-day urgent appointments, direct specialist consultations..."
                maxLength={140}
                rows={2}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. SERVICES SECTION CONTENT
  // ==========================================
  if (section.type === "services") {
    const srvData = (section.data || {}) as Partial<ServicesSectionData>;
    const services = srvData.services || [];

    const handleAddService = () => {
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        iconName: "Stethoscope",
        name: "New Medical Specialty",
        badge: "Specialized",
        description: "Comprehensive diagnostics and tailored clinical treatment.",
        highlights: ["Expert Consultations", "Advanced Diagnostics"],
      };
      updateSectionData({ services: [...services, newService] });
      setExpandedItemId(newService.id);
    };

    const handleUpdateService = (idx: number, updates: Partial<ServiceItem>) => {
      const clone = [...services];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ services: clone });
    };

    const handleDeleteService = (id: string) => {
      updateSectionData({ services: services.filter((s) => s.id !== id) });
    };

    return (
      <div className="space-y-4 p-4">
        {/* Header fields */}
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={srvData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Specialized Disciplines"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={srvData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Comprehensive Medical Services"
            maxLength={70}
          />
          <TextAreaField
            label="Section Description"
            value={srvData.description || ""}
            onChange={(val) => updateSectionData({ description: val })}
            placeholder="Delivering evidence-based clinical programs across all key medical disciplines."
            maxLength={180}
            rows={2}
          />
        </div>

        {/* Repeating Services List */}
        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Services Catalog ({services.length})
            </label>
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-2">
            {services.map((srv, idx) => {
              const isExpanded = expandedItemId === srv.id;
              return (
                <div
                  key={srv.id}
                  className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xs overflow-hidden transition"
                >
                  <div
                    onClick={() => toggleExpand(srv.id)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-[hsl(var(--muted)/.4)]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
                        <Stethoscope size={13} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[hsl(var(--foreground))] block truncate">
                          {srv.name || `Service #${idx + 1}`}
                        </span>
                        {srv.badge && (
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app block truncate">
                            {srv.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(srv.id);
                        }}
                        className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 p-1 rounded cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronDown
                        size={14}
                        className={`text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 pt-0 space-y-2.5 border-t border-[hsl(var(--border)/.5)] mt-1">
                      <TextField
                        label="Service Name"
                        value={srv.name}
                        onChange={(val) => handleUpdateService(idx, { name: val })}
                        maxLength={50}
                      />
                      <TextField
                        label="Badge Tag"
                        value={srv.badge || ""}
                        onChange={(val) => handleUpdateService(idx, { badge: val })}
                        placeholder="e.g. 24/7 Triage, Specialist"
                        maxLength={30}
                      />
                      <TextAreaField
                        label="Description"
                        value={srv.description}
                        onChange={(val) => handleUpdateService(idx, { description: val })}
                        maxLength={180}
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. DOCTORS SECTION CONTENT
  // ==========================================
  if (section.type === "doctors") {
    const docData = (section.data || {}) as Partial<DoctorsSectionData>;
    const doctors = docData.doctors || [];

    const handleAddDoctor = () => {
      const newDoc: DoctorProfile = {
        id: `doc-${Date.now()}`,
        name: "Dr. New Specialist",
        role: "Attending Physician",
        department: "General Medicine",
        credentials: "MD, Board-Certified",
        experience: "10+ Years Experience",
      };
      updateSectionData({ doctors: [...doctors, newDoc] });
      setExpandedItemId(newDoc.id);
    };

    const handleUpdateDoctor = (idx: number, updates: Partial<DoctorProfile>) => {
      const clone = [...doctors];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ doctors: clone });
    };

    const handleDeleteDoctor = (id: string) => {
      updateSectionData({ doctors: doctors.filter((d) => d.id !== id) });
    };

    return (
      <div className="space-y-4 p-4">
        {/* Header fields */}
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={docData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Clinical Leadership"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={docData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Board-Certified Specialists"
            maxLength={70}
          />
          <TextAreaField
            label="Section Description"
            value={docData.description || ""}
            onChange={(val) => updateSectionData({ description: val })}
            placeholder="Our team of dedicated clinicians brings decades of academic and clinical excellence."
            maxLength={180}
            rows={2}
          />
        </div>

        {/* Repeating Doctors List */}
        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Medical Roster ({doctors.length})
            </label>
            <button
              type="button"
              onClick={handleAddDoctor}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="space-y-2">
            {doctors.map((doc, idx) => {
              const isExpanded = expandedItemId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xs overflow-hidden transition"
                >
                  <div
                    onClick={() => toggleExpand(doc.id)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-[hsl(var(--muted)/.4)]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {doc.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          className="h-7 w-7 rounded-full object-cover border border-[hsl(var(--border))] shrink-0"
                        />
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-[10px] font-bold">
                          {doc.name.replace(/^(Dr\.?\s*)/i, "").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[hsl(var(--foreground))] block truncate">
                          {doc.name || `Doctor #${idx + 1}`}
                        </span>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app block truncate">
                          {doc.role} {doc.department ? `· ${doc.department}` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoctor(doc.id);
                        }}
                        className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 p-1 rounded cursor-pointer"
                        title="Delete doctor"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronDown
                        size={14}
                        className={`text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 pt-0 space-y-2.5 border-t border-[hsl(var(--border)/.5)] mt-1">
                      <TextField
                        label="Full Name & Title"
                        value={doc.name}
                        onChange={(val) => handleUpdateDoctor(idx, { name: val })}
                        maxLength={50}
                      />
                      <TextField
                        label="Role / Clinical Position"
                        value={doc.role}
                        onChange={(val) => handleUpdateDoctor(idx, { role: val })}
                        maxLength={50}
                      />
                      <TextField
                        label="Department / Specialty"
                        value={doc.department || ""}
                        onChange={(val) => handleUpdateDoctor(idx, { department: val })}
                        placeholder="e.g. Cardiology, Pediatrics"
                        maxLength={40}
                      />
                      <TextField
                        label="Credentials & Degrees"
                        value={doc.credentials}
                        onChange={(val) => handleUpdateDoctor(idx, { credentials: val })}
                        placeholder="e.g. MD, FACS, Harvard Medical"
                        maxLength={50}
                      />
                      <TextField
                        label="Experience Duration"
                        value={doc.experience}
                        onChange={(val) => handleUpdateDoctor(idx, { experience: val })}
                        placeholder="e.g. 15+ Years Clinical Experience"
                        maxLength={40}
                      />

                      <ImageSlotControl
                        label="Doctor Photo"
                        imageUrl={doc.imageUrl}
                        aspectRatio="portrait"
                        onOpenModal={() => onOpenImageModal && onOpenImageModal(`doctor.${doc.id}`)}
                        onRemove={() => handleUpdateDoctor(idx, { imageUrl: undefined })}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. REVIEWS SECTION CONTENT
  // ==========================================
  if (section.type === "reviews") {
    const revData = (section.data || {}) as Partial<ReviewsSectionData>;
    const reviews = revData.reviews || [];

    const handleAddReview = () => {
      const newRev: TestimonialItem = {
        id: `rev-${Date.now()}`,
        patientName: "Verified Patient",
        treatment: "Outpatient Care",
        rating: 5,
        quote: "Exceptional care from start to finish. The medical staff was attentive, empathetic, and professional.",
        date: "Recently verified",
      };
      updateSectionData({ reviews: [...reviews, newRev] });
      setExpandedItemId(newRev.id);
    };

    const handleUpdateReview = (idx: number, updates: Partial<TestimonialItem>) => {
      const clone = [...reviews];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ reviews: clone });
    };

    const handleDeleteReview = (id: string) => {
      updateSectionData({ reviews: reviews.filter((r) => r.id !== id) });
    };

    return (
      <div className="space-y-4 p-4">
        {/* Header fields */}
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={revData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Patient Voices"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={revData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Trusted by Thousands of Families"
            maxLength={70}
          />
          <TextAreaField
            label="Section Description"
            value={revData.description || ""}
            onChange={(val) => updateSectionData({ description: val })}
            placeholder="Read authentic reviews from patients who experienced our compassionate care."
            maxLength={180}
            rows={2}
          />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <TextField
              label="Rating Score"
              value={revData.ratingAverage || "4.95"}
              onChange={(val) => updateSectionData({ ratingAverage: val })}
              placeholder="4.95"
              maxLength={10}
            />
            <TextField
              label="Review Count Badge"
              value={revData.totalReviews || "12,400+ Verified"}
              onChange={(val) => updateSectionData({ totalReviews: val })}
              placeholder="12,400+ Verified"
              maxLength={30}
            />
          </div>
        </div>

        {/* Repeating Reviews List */}
        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Testimonials ({reviews.length})
            </label>
            <button
              type="button"
              onClick={handleAddReview}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Review</span>
            </button>
          </div>

          <div className="space-y-2">
            {reviews.map((rev, idx) => {
              const isExpanded = expandedItemId === rev.id;
              return (
                <div
                  key={rev.id}
                  className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xs overflow-hidden transition"
                >
                  <div
                    onClick={() => toggleExpand(rev.id)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-[hsl(var(--muted)/.4)]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                        <Star size={13} fill="currentColor" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[hsl(var(--foreground))] block truncate">
                          {rev.patientName || `Review #${idx + 1}`}
                        </span>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app block truncate">
                          {rev.treatment} · {rev.rating}★
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReview(rev.id);
                        }}
                        className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 p-1 rounded cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronDown
                        size={14}
                        className={`text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 pt-0 space-y-2.5 border-t border-[hsl(var(--border)/.5)] mt-1">
                      <TextField
                        label="Patient Name"
                        value={rev.patientName}
                        onChange={(val) => handleUpdateReview(idx, { patientName: val })}
                        maxLength={40}
                      />
                      <TextField
                        label="Treatment / Procedure"
                        value={rev.treatment}
                        onChange={(val) => handleUpdateReview(idx, { treatment: val })}
                        placeholder="e.g. Cardiology Consultation"
                        maxLength={40}
                      />
                      <TextAreaField
                        label="Patient Quote"
                        value={rev.quote}
                        onChange={(val) => handleUpdateReview(idx, { quote: val })}
                        maxLength={220}
                        rows={3}
                      />
                      <TextField
                        label="Review Date / Tag"
                        value={rev.date}
                        onChange={(val) => handleUpdateReview(idx, { date: val })}
                        placeholder="e.g. 2 weeks ago, Verified Patient"
                        maxLength={30}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. STATS SECTION CONTENT
  // ==========================================
  if (section.type === "stats") {
    const statsData = (section.data || {}) as Partial<StatsSectionData>;
    const items = statsData.items || [];

    const handleAddStat = () => {
      const newStat: StatItem = {
        id: `stat-${Date.now()}`,
        value: "99%",
        label: "Clinical Metric",
        subtext: "Verified annual survey",
      };
      updateSectionData({ items: [...items, newStat] });
    };

    const handleUpdateStat = (idx: number, updates: Partial<StatItem>) => {
      const clone = [...items];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ items: clone });
    };

    const handleDeleteStat = (id: string) => {
      updateSectionData({ items: items.filter((s) => s.id !== id) });
    };

    return (
      <div className="space-y-4 p-4">
        <TextField
          label="Section Title (Optional)"
          value={statsData.headline || ""}
          onChange={(val) => updateSectionData({ headline: val })}
          placeholder="e.g. Our Clinical Track Record"
          maxLength={70}
        />

        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Stat Metrics ({items.length})
            </label>
            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((stat, idx) => (
              <div
                key={stat.id}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    Metric #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(stat.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 p-0.5 rounded cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Value"
                    value={stat.value}
                    onChange={(val) => handleUpdateStat(idx, { value: val })}
                    placeholder="e.g. 99.8%"
                    maxLength={15}
                  />
                  <TextField
                    label="Label"
                    value={stat.label}
                    onChange={(val) => handleUpdateStat(idx, { label: val })}
                    placeholder="e.g. Satisfaction"
                    maxLength={30}
                  />
                </div>
                <TextField
                  label="Subtext Note"
                  value={stat.subtext}
                  onChange={(val) => handleUpdateStat(idx, { subtext: val })}
                  placeholder="e.g. Verified by 10k visits"
                  maxLength={40}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. WHY US SECTION CONTENT
  // ==========================================
  if (section.type === "why_us") {
    const whyData = (section.data || {}) as Partial<WhyUsSectionData>;
    const pillars = whyData.pillars || [];

    const handleAddPillar = () => {
      const newPillar: TrustPillar = {
        id: `pil-${Date.now()}`,
        iconName: "ShieldCheck",
        title: "Evidence-Based Care",
        description: "Adhering to strict clinical protocols and continuous peer review.",
      };
      updateSectionData({ pillars: [...pillars, newPillar] });
    };

    const handleUpdatePillar = (idx: number, updates: Partial<TrustPillar>) => {
      const clone = [...pillars];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ pillars: clone });
    };

    const handleDeletePillar = (id: string) => {
      updateSectionData({ pillars: pillars.filter((p) => p.id !== id) });
    };

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={whyData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Why Patients Choose Us"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={whyData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Excellence in Clinical Care"
            maxLength={70}
          />
          <TextAreaField
            label="Section Description"
            value={whyData.description || ""}
            onChange={(val) => updateSectionData({ description: val })}
            placeholder="We combine patient-first hospitality with cutting-edge medical technology."
            maxLength={180}
            rows={2}
          />
        </div>

        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
              Trust Pillars ({pillars.length})
            </label>
            <button
              type="button"
              onClick={handleAddPillar}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="space-y-2">
            {pillars.map((pil, idx) => (
              <div
                key={pil.id}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePillar(pil.id)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-rose-500 p-0.5 rounded cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <TextField
                  label="Title"
                  value={pil.title}
                  onChange={(val) => handleUpdatePillar(idx, { title: val })}
                  maxLength={40}
                />
                <TextAreaField
                  label="Description"
                  value={pil.description}
                  onChange={(val) => handleUpdatePillar(idx, { description: val })}
                  maxLength={140}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. HOURS SECTION CONTENT
  // ==========================================
  if (section.type === "hours") {
    const hoursData = (section.data || {}) as Partial<HoursSectionData>;
    const schedule = hoursData.schedule || [];

    const handleUpdateDay = (idx: number, updates: Partial<ScheduleDay>) => {
      const clone = [...schedule];
      clone[idx] = { ...clone[idx], ...updates };
      updateSectionData({ schedule: clone });
    };

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={hoursData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Operating Schedule"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={hoursData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Clinic Hours & Urgent Triage"
            maxLength={70}
          />

          <MicroToggle
            label="Emergency Hotline Notice"
            description="Display 24/7 on-call triage banner"
            checked={hoursData.showEmergencyNotice !== false}
            onChange={(checked) => updateSectionData({ showEmergencyNotice: checked })}
            icon={PhoneCall}
            badge="Alert"
          />

          {hoursData.showEmergencyNotice !== false && (
            <div className="space-y-2 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <TextField
                label="Emergency Hotline Phone"
                value={hoursData.emergencyHotline || ""}
                onChange={(val) => updateSectionData({ emergencyHotline: val })}
                placeholder="+1 (800) 555-0199"
                maxLength={25}
              />
              <TextAreaField
                label="Emergency Banner Note"
                value={hoursData.emergencyNotice || ""}
                onChange={(val) => updateSectionData({ emergencyNotice: val })}
                placeholder="Physicians on-call 24 hours a day for emergency triage."
                maxLength={120}
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Schedule Table */}
        <div className="space-y-2.5 pt-2 border-t border-[hsl(var(--border))]">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Weekly Schedule Days ({schedule.length})
          </label>
          <div className="space-y-2">
            {schedule.map((slot, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5 shadow-2xs"
              >
                <TextField
                  label="Day(s)"
                  value={slot.day}
                  onChange={(val) => handleUpdateDay(idx, { day: val })}
                  maxLength={25}
                />
                <TextField
                  label="Working Hours"
                  value={slot.hours}
                  onChange={(val) => handleUpdateDay(idx, { hours: val })}
                  placeholder="8:00 AM – 8:00 PM"
                  maxLength={30}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. BOOKING SECTION CONTENT
  // ==========================================
  if (section.type === "booking") {
    const bookData = (section.data || {}) as Partial<BookingSectionData>;

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <TextField
            label="Section Eyebrow"
            value={bookData.eyebrow || ""}
            onChange={(val) => updateSectionData({ eyebrow: val })}
            placeholder="Online Scheduling"
            maxLength={40}
          />
          <TextField
            label="Section Headline"
            value={bookData.headline || ""}
            onChange={(val) => updateSectionData({ headline: val })}
            placeholder="Book Your Consultation"
            maxLength={70}
          />
          <TextField
            label="Form Header Title"
            value={bookData.formTitle || ""}
            onChange={(val) => updateSectionData({ formTitle: val })}
            placeholder="Request an Appointment"
            maxLength={50}
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Location &amp; Contact Info
          </label>
          <TextField
            label="Clinic Street Address"
            value={bookData.address || ""}
            onChange={(val) => updateSectionData({ address: val })}
            placeholder="100 Medical Center Parkway, Suite 400"
            maxLength={70}
            prefixIcon={MapPin}
          />
          <TextField
            label="City, State & Postal"
            value={bookData.cityState || ""}
            onChange={(val) => updateSectionData({ cityState: val })}
            placeholder="New York, NY 10001"
            maxLength={50}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Contact Phone"
              value={bookData.phone || ""}
              onChange={(val) => updateSectionData({ phone: val })}
              placeholder="+1 (555) 019-2834"
              maxLength={25}
              prefixIcon={Phone}
            />
            <TextField
              label="Contact Email"
              value={bookData.email || ""}
              onChange={(val) => updateSectionData({ email: val })}
              placeholder="appointments@clinic.com"
              maxLength={40}
              prefixIcon={Mail}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <MicroToggle
            label="Google Map Preview"
            description="Display interactive clinic map"
            checked={bookData.showMap !== false}
            onChange={(checked) => updateSectionData({ showMap: checked })}
            icon={MapPin}
            badge="Map"
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // 9. NAVBAR SECTION CONTENT
  // ==========================================
  if (section.type === "navbar") {
    const nav = (section.data || {}) as Partial<NavbarSectionData>;
    const logoMode: LogoMode = nav.logoMode || "icon_text";

    const logoOptions: SegmentedOption<LogoMode>[] = [
      { value: "icon_text", label: "Icon + Text", icon: Navigation },
      { value: "text_only", label: "Text Only", icon: FileText },
      { value: "image", label: "Custom Logo", icon: ImageIcon },
      { value: "accent_split", label: "Accent Split", icon: Sparkles },
    ];

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <TextField
            label="Hospital / Clinic Name"
            value={nav.hospitalName || ""}
            onChange={(val) => updateSectionData({ hospitalName: val })}
            placeholder="Apex Health Medical Center"
            maxLength={60}
          />

          <MicroToggle
            label="Tagline / Department Subtext"
            description="Display descriptor text below hospital name"
            checked={nav.showTagline !== false}
            onChange={(checked) => updateSectionData({ showTagline: checked })}
            badge="Text"
          />

          {nav.showTagline !== false && (
            <TextField
              label="Tagline Text"
              value={nav.tagline || ""}
              onChange={(val) => updateSectionData({ tagline: val })}
              placeholder="Emergency & Specialty Medicine"
              maxLength={60}
            />
          )}

          <SegmentedPicker<LogoMode>
            label="Logo Presentation Mode"
            options={logoOptions}
            value={logoMode}
            onChange={(m) => updateSectionData({ logoMode: m })}
          />

          {logoMode === "image" && (
            <ImageSlotControl
              label="Custom Logo Image"
              imageUrl={nav.logoUrl}
              aspectRatio="1:1"
              onOpenModal={() => onOpenImageModal && onOpenImageModal("navbar.logoUrl")}
              onRemove={() => updateSectionData({ logoUrl: undefined })}
            />
          )}

          {logoMode === "accent_split" && (
            <TextField
              label="Accent Brand Word"
              value={nav.accentWord || "Health"}
              onChange={(val) => updateSectionData({ accentWord: val })}
              placeholder="Health"
              maxLength={20}
              helpText="This word is highlighted in your primary brand color."
            />
          )}
        </div>

        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <MicroToggle
            label="Top Emergency Hotline Bar"
            description="Display red alert banner above navigation"
            checked={nav.showEmergencyTopBar !== false}
            onChange={(checked) => updateSectionData({ showEmergencyTopBar: checked })}
            icon={PhoneCall}
            badge="Top Bar"
          />

          {nav.showEmergencyTopBar !== false && (
            <TextField
              label="Emergency Phone Number"
              value={nav.emergencyPhone || ""}
              onChange={(val) => updateSectionData({ emergencyPhone: val })}
              placeholder="+1 (800) 555-0199"
              maxLength={25}
            />
          )}

          <ActionLinkChip
            label={nav.ctaText || "Book Visit"}
            actionType={site.buttonConfigs?.["navbar.cta"]?.actionType || "section"}
            target={site.buttonConfigs?.["navbar.cta"]?.target || "#booking"}
            variant={site.buttonConfigs?.["navbar.cta"]?.variant || "btn-primary"}
            openInNewTab={site.buttonConfigs?.["navbar.cta"]?.openInNewTab}
            onChange={(updated) => {
              updateSectionData({ ctaText: updated.label });
              onChange({
                ...site,
                buttonConfigs: { ...site.buttonConfigs, "navbar.cta": updated },
              });
            }}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // 10. FOOTER SECTION CONTENT
  // ==========================================
  if (section.type === "footer") {
    const foot = (section.data || {}) as Partial<FooterSectionData>;

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <TextField
            label="Hospital / Organization Name"
            value={foot.hospitalName || ""}
            onChange={(val) => updateSectionData({ hospitalName: val })}
            maxLength={60}
          />
          <TextAreaField
            label="Brand Mission / Description"
            value={foot.description || ""}
            onChange={(val) => updateSectionData({ description: val })}
            placeholder="Providing high-precision emergency and ambulatory medical care..."
            maxLength={200}
            rows={2}
          />
          <TextField
            label="Accreditation Badge"
            value={foot.accreditationBadge || ""}
            onChange={(val) => updateSectionData({ accreditationBadge: val })}
            placeholder="JCI Accredited Healthcare Institution"
            maxLength={60}
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
            Footer Legal &amp; Disclaimer
          </label>
          <TextAreaField
            label="Medical Disclaimer"
            value={foot.medicalDisclaimer || ""}
            onChange={(val) => updateSectionData({ medicalDisclaimer: val })}
            placeholder="Information provided on this site is not a substitute for professional medical advice."
            maxLength={240}
            rows={2}
          />
          <TextField
            label="Copyright Text"
            value={foot.copyrightText || ""}
            onChange={(val) => updateSectionData({ copyrightText: val })}
            placeholder="© 2026 Apex Health Medical. All rights reserved."
            maxLength={80}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-xs text-[hsl(var(--muted-foreground))]">
      Select a section to inspect its content properties.
    </div>
  );
}
