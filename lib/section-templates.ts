import {
  DEFAULT_CLINIC_DATA,
  type SectionBlock,
  type SectionType,
  type SectionStyleConfig,
} from "./builder-types";

export interface BlockCatalogItem {
  id: string;
  type: SectionType;
  preset: string;
  category: "hero" | "services" | "doctors" | "stats" | "why_us" | "reviews" | "hours" | "booking";
  title: string;
  subtitle: string;
  description: string;
  layoutWireframe: "split" | "centered" | "grid3" | "grid4" | "grid2" | "carousel" | "list" | "featured" | "banner";
  badges: string[];
}

export const BLOCK_CATALOG: BlockCatalogItem[] = [
  // Heroes
  {
    id: "hero_split",
    type: "hero",
    preset: "split_media_right",
    category: "hero",
    title: "Split 50/50 Hero",
    subtitle: "Standard Healthcare Header",
    description: "High-impact headline and primary CTA on the left with doctor/facility photography on the right.",
    layoutWireframe: "split",
    badges: ["Most Popular", "High Conversion"],
  },
  {
    id: "hero_centered",
    type: "hero",
    preset: "centered_editorial",
    category: "hero",
    title: "Centered Editorial Hero",
    subtitle: "Brand-Focused Header",
    description: "Grand centered headline and trust badges with a full-width panoramic clinical image below.",
    layoutWireframe: "centered",
    badges: ["Editorial", "Spacious"],
  },
  {
    id: "hero_action_card",
    type: "hero",
    preset: "action_card_right",
    category: "hero",
    title: "Lead Capture Hero",
    subtitle: "Direct Booking Trigger",
    description: "Combines your core medical promise with an immediate consultation inquiry card.",
    layoutWireframe: "split",
    badges: ["Lead Generation"],
  },
  {
    id: "hero_minimal",
    type: "hero",
    preset: "minimal_text",
    category: "hero",
    title: "Minimalist Typographic Hero",
    subtitle: "Urgent & Direct",
    description: "Pure high-contrast typography and instant action triggers without stock photo distractions.",
    layoutWireframe: "centered",
    badges: ["Clean", "Fast Load"],
  },

  // Services
  {
    id: "services_grid3",
    type: "services",
    preset: "grid_3",
    category: "services",
    title: "3-Column Department Grid",
    subtitle: "Standard Clinical Services",
    description: "Balanced presentation of core departments with iconography, descriptions, and feature tags.",
    layoutWireframe: "grid3",
    badges: ["Standard", "Balanced"],
  },
  {
    id: "services_grid4",
    type: "services",
    preset: "grid_4",
    category: "services",
    title: "4-Column Compact Matrix",
    subtitle: "Comprehensive Capabilities",
    description: "Dense 4-across grid ideal for clinics offering an extensive menu of treatments.",
    layoutWireframe: "grid4",
    badges: ["Dense", "Multi-Service"],
  },
  {
    id: "services_grid2",
    type: "services",
    preset: "grid_2",
    category: "services",
    title: "2-Column Detailed Cards",
    subtitle: "Specialized Deep Dive",
    description: "Expanded two-column layout with in-depth procedure descriptions and bullet point highlights.",
    layoutWireframe: "grid2",
    badges: ["In-Depth"],
  },
  {
    id: "services_carousel",
    type: "services",
    preset: "carousel",
    category: "services",
    title: "Horizontal Carousel Track",
    subtitle: "Swipeable Card Slider",
    description: "Space-saving horizontal card track with touch-snap scrolling on mobile and desktop.",
    layoutWireframe: "carousel",
    badges: ["Mobile-Friendly", "Interactive"],
  },

  // Doctors
  {
    id: "doctors_grid3",
    type: "doctors",
    preset: "grid_3",
    category: "doctors",
    title: "3-Column Medical Team",
    subtitle: "Specialist Physician Roster",
    description: "Photo cards highlighting specialist doctors, credentials, board certifications, and roles.",
    layoutWireframe: "grid3",
    badges: ["Physicians"],
  },
  {
    id: "doctors_grid4",
    type: "doctors",
    preset: "grid_4",
    category: "doctors",
    title: "4-Column Staff Matrix",
    subtitle: "Multi-Disciplinary Team",
    description: "Compact team grid perfect for clinics with 4 or more primary physicians.",
    layoutWireframe: "grid4",
    badges: ["Compact"],
  },
  {
    id: "doctors_list",
    type: "doctors",
    preset: "list_detailed",
    category: "doctors",
    title: "Horizontal Bio List",
    subtitle: "Editorial Leadership Profiles",
    description: "Wide horizontal bio cards pairing portrait photos with detailed medical background and direct booking.",
    layoutWireframe: "list",
    badges: ["Executive", "Detailed"],
  },

  // Proof & Stats
  {
    id: "stats_grid4",
    type: "stats",
    preset: "grid_4",
    category: "stats",
    title: "4-Metric Proof Grid",
    subtitle: "Quantified Clinical Authority",
    description: "4 large numeric indicators for patient satisfaction, treatment volume, and years in practice.",
    layoutWireframe: "grid4",
    badges: ["Social Proof"],
  },
  {
    id: "stats_inline",
    type: "stats",
    preset: "inline_bar",
    category: "stats",
    title: "Continuous Ribbon Banner",
    subtitle: "Compact Proof Strip",
    description: "Single horizontal ribbon banner showing key trust statistics without consuming vertical space.",
    layoutWireframe: "banner",
    badges: ["Compact Strip"],
  },

  // Why Us
  {
    id: "whyus_pillars",
    type: "why_us",
    preset: "pillars_3",
    category: "why_us",
    title: "3 Trust Pillars Grid",
    subtitle: "Core Value Propositions",
    description: "Three distinct cards detailing patient advantages: advanced technology, zero wait times, and expert staff.",
    layoutWireframe: "grid3",
    badges: ["Trust"],
  },
  {
    id: "whyus_split",
    type: "why_us",
    preset: "split_list",
    category: "why_us",
    title: "Split 50/50 Feature List",
    subtitle: "Sticky Value Proposition",
    description: "Sticky mission statement on the left with stacked benefit cards on the right.",
    layoutWireframe: "split",
    badges: ["Storytelling"],
  },

  // Reviews
  {
    id: "reviews_grid3",
    type: "reviews",
    preset: "grid_3",
    category: "reviews",
    title: "3-Card Patient Testimonials",
    subtitle: "Verified Patient Reviews",
    description: "Three balanced testimonial cards featuring patient feedback, 5-star ratings, and visit contexts.",
    layoutWireframe: "grid3",
    badges: ["5-Star Reviews"],
  },
  {
    id: "reviews_featured",
    type: "reviews",
    preset: "featured_quote",
    category: "reviews",
    title: "Featured Quote Spotlight",
    subtitle: "Hero Patient Story",
    description: "A prominent centerpiece quote banner followed by supporting secondary review cards.",
    layoutWireframe: "featured",
    badges: ["Spotlight"],
  },

  // Hours & Schedule
  {
    id: "hours_split",
    type: "hours",
    preset: "split_table",
    category: "hours",
    title: "Split Schedule & Urgent Triage",
    subtitle: "Operating Hours & Walk-in Info",
    description: "Structured daily schedule table on the left with 24/7 urgent care hotline and directions on the right.",
    layoutWireframe: "split",
    badges: ["Essential Info"],
  },
  {
    id: "hours_card",
    type: "hours",
    preset: "card_center",
    category: "hours",
    title: "Unified Schedule Card",
    subtitle: "Centered Hours Box",
    description: "Clean, single-box operating hours layout ideal for standard outpatient clinics.",
    layoutWireframe: "centered",
    badges: ["Clean Card"],
  },

  // Booking & Contact
  {
    id: "booking_split",
    type: "booking",
    preset: "split_form_map",
    category: "booking",
    title: "Appointment Form + Clinic Map",
    subtitle: "Full Contact Experience",
    description: "Interactive consultation booking form paired with clinic coordinates and transport information.",
    layoutWireframe: "split",
    badges: ["High Conversion"],
  },
  {
    id: "booking_compact",
    type: "booking",
    preset: "compact_card",
    category: "booking",
    title: "Centered Booking Card",
    subtitle: "Focused Appointment Box",
    description: "A distraction-free, centered single-card appointment request form with direct submission.",
    layoutWireframe: "centered",
    badges: ["Focused"],
  },
];

export function createNewSection(type: SectionType, preset?: string): SectionBlock {
  const defaultTemplate = DEFAULT_CLINIC_DATA.sections.find((s) => s.type === type);
  const rawData = defaultTemplate ? structuredClone(defaultTemplate.data) : {};

  const resolvedPreset = preset || (type === "hero" ? "split_media_right" : type === "services" ? "grid_3" : "default");

  const defaultStyle: SectionStyleConfig = {
    layoutPreset: resolvedPreset,
    surfaceStyle: "default",
    verticalPadding: "balanced",
    contentAlignment: "left",
    containerWidth: "standard",
    cardRadius: "smooth",
    cardElevation: "subtle",
    cardBorder: "hairline",
  };

  const uniqueId = `sec-${type}-${Date.now().toString(36).slice(-4)}`;

  return {
    id: uniqueId,
    type,
    enabled: true,
    order: 99,
    style: defaultStyle,
    data: rawData as SectionBlock["data"],
  };
}
