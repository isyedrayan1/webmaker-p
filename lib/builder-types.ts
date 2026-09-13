export type ThemeColor = "emerald" | "navy" | "teal" | "indigo" | "terracotta" | "slate";

export interface ThemeConfig {
  name: string;
  category: string;
  primary: string;
  primaryHover: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  textDark: string;
  textMuted: string;
}

export const THEME_PALETTES: Record<ThemeColor, ThemeConfig> = {
  emerald: {
    name: "Spruce Emerald",
    category: "General & Wellness",
    primary: "#285459",
    primaryHover: "#1d3e42",
    accent: "#e5a842",
    bgLight: "#f7f5ef",
    bgDark: "#172729",
    borderLight: "#e2ded4",
    textDark: "#1a2a2c",
    textMuted: "#66787a",
  },
  navy: {
    name: "Nordic Navy",
    category: "Hospital & Surgery",
    primary: "#1e3a8a",
    primaryHover: "#172554",
    accent: "#38bdf8",
    bgLight: "#f0f7ff",
    bgDark: "#0f172a",
    borderLight: "#dbeafe",
    textDark: "#0f172a",
    textMuted: "#64748b",
  },
  teal: {
    name: "Pacific Teal",
    category: "Dental & Ortho",
    primary: "#0d6b62",
    primaryHover: "#084e47",
    accent: "#5eead4",
    bgLight: "#f2faf7",
    bgDark: "#082f2c",
    borderLight: "#d1e9e3",
    textDark: "#112b27",
    textMuted: "#557570",
  },
  indigo: {
    name: "Clinical Indigo",
    category: "Cardiology & Specialists",
    primary: "#4338ca",
    primaryHover: "#3730a3",
    accent: "#818cf8",
    bgLight: "#f5f3ff",
    bgDark: "#1e1b4b",
    borderLight: "#e0e7ff",
    textDark: "#1e1b4b",
    textMuted: "#6b7280",
  },
  terracotta: {
    name: "Warm Terracotta",
    category: "Pediatric & Family",
    primary: "#9a3412",
    primaryHover: "#7c2d12",
    accent: "#fdba74",
    bgLight: "#fff7ed",
    bgDark: "#431407",
    borderLight: "#fed7aa",
    textDark: "#431407",
    textMuted: "#78716c",
  },
  slate: {
    name: "Platinum Slate",
    category: "Diagnostics & Imaging",
    primary: "#334155",
    primaryHover: "#1e293b",
    accent: "#0ea5e9",
    bgLight: "#f8fafc",
    bgDark: "#0f172a",
    borderLight: "#e2e8f0",
    textDark: "#0f172a",
    textMuted: "#64748b",
  },
};

// Section Models
export interface NavLink {
  label: string;
  href: string;
}

export type LogoMode = "icon_text" | "text_only" | "icon_only" | "image" | "accent_split";

export interface NavbarSectionData {
  hospitalName: string;
  tagline?: string;
  showTagline?: boolean;
  logoType?: "icon_text" | "image" | "text_only"; // legacy fallback
  logoMode?: LogoMode;
  logoUrl?: string;
  accentWord?: string;
  showEmergencyTopBar?: boolean;
  emergencyPhone?: string;
  ctaText?: string;
  links: NavLink[];
}

export type HeroVisualMode = "image" | "action_card" | "hotline_box" | "trust_cluster" | "editorial" | "none";

export interface HeroSectionData {
  badge?: string;
  showBadge?: boolean;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta?: string;
  showSecondaryCta?: boolean;
  trustSnippet?: string;
  visualMode?: HeroVisualMode;
  imageUrl?: string;
  cardTitle?: string;
  cardBody?: string;
  cardCta?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  subtext: string;
}
export type MetricItem = StatItem;

export interface StatsSectionData {
  headline?: string;
  items: StatItem[];
}

export interface TrustPillar {
  id: string;
  iconName: string;
  title: string;
  description: string;
}
export type PillarItem = TrustPillar;

export interface WhyUsSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  pillars: TrustPillar[];
}

export interface ServiceItem {
  id: string;
  iconName: string;
  name: string;
  badge?: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
}
export type ServiceCard = ServiceItem;

export interface ServicesSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  services: ServiceItem[];
}

export interface DoctorProfile {
  id: string;
  name: string;
  role: string;
  department?: string;
  credentials: string;
  experience: string;
  imageUrl?: string;
}

export interface DoctorsSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  doctors: DoctorProfile[];
}

export interface TestimonialItem {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  quote: string;
  date: string;
}

export interface ReviewsSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  ratingAverage?: string;
  totalReviews?: string;
  showRatingSummary?: boolean;
  reviews: TestimonialItem[];
}

export interface ScheduleDay {
  day: string;
  hours: string;
}

export interface HoursSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  showEmergencyNotice?: boolean;
  emergencyNotice?: string;
  emergencyHotline?: string;
  schedule: ScheduleDay[];
}

export interface BookingSectionData {
  eyebrow?: string;
  headline: string;
  description?: string;
  address?: string;
  cityState?: string;
  phone?: string;
  email?: string;
  showMap?: boolean;
  mapEmbedUrl?: string;
  formTitle: string;
  departments: string[];
}

export interface FooterSectionData {
  hospitalName: string;
  description?: string;
  accreditationBadge?: string;
  phone?: string;
  email?: string;
  address?: string;
  quickLinks: { label: string; href: string }[];
  medicalDisclaimer?: string;
  copyrightText?: string;
}

export type SectionType =
  | "navbar"
  | "hero"
  | "stats"
  | "why_us"
  | "services"
  | "doctors"
  | "reviews"
  | "hours"
  | "booking"
  | "footer";

export interface SectionBlock {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data:
    | NavbarSectionData
    | HeroSectionData
    | StatsSectionData
    | WhyUsSectionData
    | ServicesSectionData
    | DoctorsSectionData
    | ReviewsSectionData
    | HoursSectionData
    | BookingSectionData
    | FooterSectionData;
}

export interface ButtonActionConfig {
  label?: string;
  actionType: "section" | "url" | "phone" | "email";
  target: string;
  openInNewTab?: boolean;
  variant?: "btn-primary" | "btn-accent" | "btn-outline";
}

export interface UploadedAssetMeta {
  key: string;
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface SiteMediaAssets {
  faviconUrl?: string;
  ogImageUrl?: string;
  heroImageFit?: "cover" | "contain";
  heroImageRadius?: "none" | "rounded" | "circle";
  heroImageShadow?: "none" | "subtle" | "glow";
  heroImageOverlay?: "none" | "dark" | "gradient";
  heroImageAlt?: string;
  uploadedAssets?: UploadedAssetMeta[];
}

export interface LandingPageData {
  id: string;
  name: string;
  clientName: string;
  templateId: string;
  theme: ThemeColor;
  domain?: string | null;
  status: "draft" | "awaiting_approval" | "approved" | "published" | "live";
  sections: SectionBlock[];
  updatedAt: string;
  publishedAt?: string | null;
  buttonConfigs?: Record<string, ButtonActionConfig>;
  buttonLinks?: Record<string, string>;
  assets?: SiteMediaAssets;
  seo?: {
    title?: string;
    description?: string;
  };
}

// -------------------------------------------------------------
// DESIGN GUARDRAILS: Semantic Character & Item Count Limits
// -------------------------------------------------------------
export const FIELD_GUARDRAIL_LIMITS: Record<string, number> = {
  // Navbar
  "navbar.hospitalName": 60,
  "navbar.tagline": 60,
  "navbar.ctaText": 24,
  "navbar.emergencyPhone": 22,

  // Hero (Default + Max 2 lines)
  "hero.badge": 45,
  "hero.headline": 80,
  "hero.subheadline": 240,
  "hero.primaryCta": 24,
  "hero.secondaryCta": 24,
  "hero.trustSnippet": 80,

  // Stats
  "stats.value": 12,
  "stats.label": 35,
  "stats.subtext": 45,

  // Why Us
  "whyUs.eyebrow": 35,
  "whyUs.headline": 80,
  "whyUs.description": 220,
  "whyUs.pillars.title": 45,
  "whyUs.pillars.description": 140,

  // Services
  "services.eyebrow": 35,
  "services.headline": 80,
  "services.description": 220,
  "services.name": 45,
  "services.badge": 25,
  "services.description_card": 140,

  // Doctors
  "doctors.eyebrow": 35,
  "doctors.headline": 80,
  "doctors.description": 220,
  "doctors.name": 40,
  "doctors.role": 40,
  "doctors.credentials": 45,
  "doctors.experience": 30,

  // Reviews
  "reviews.eyebrow": 35,
  "reviews.headline": 80,
  "reviews.ratingAverage": 5,
  "reviews.totalReviews": 12,
  "reviews.quote": 260,
  "reviews.patientName": 35,
  "reviews.treatment": 35,

  // Hours
  "hours.eyebrow": 35,
  "hours.headline": 80,
  "hours.description": 220,
  "hours.emergencyNotice": 120,
  "hours.emergencyHotline": 22,
  "hours.schedule.day": 30,
  "hours.schedule.hours": 30,

  // Booking
  "booking.eyebrow": 35,
  "booking.headline": 80,
  "booking.description": 220,
  "booking.formTitle": 50,
  "booking.address": 70,
  "booking.cityState": 45,
  "booking.phone": 22,
  "booking.email": 35,

  // Footer
  "footer.hospitalName": 60,
  "footer.description": 200,
  "footer.accreditationBadge": 50,
  "footer.address": 70,
  "footer.phone": 22,
  "footer.email": 35,
  "footer.medicalDisclaimer": 220,
  "footer.copyrightText": 60,
};

export const SECTION_ITEM_LIMITS = {
  stats: { min: 2, max: 6, label: "Proof Metrics" },
  services: { min: 1, max: 12, label: "Services" },
  doctors: { min: 1, max: 8, label: "Doctor Profiles" },
  reviews: { min: 1, max: 9, label: "Testimonials" },
} as const;

export const FIELD_MAX_LINES: Record<string, number> = {
  "hero.headline": 2,
  "hero.subheadline": 4,
  "whyUs.headline": 2,
  "whyUs.description": 4,
  "whyUs.pillars.title": 2,
  "whyUs.pillars.description": 3,
  "services.headline": 2,
  "services.description": 4,
  "services.name": 2,
  "services.description_card": 3,
  "doctors.headline": 2,
  "doctors.description": 4,
  "doctors.name": 1,
  "reviews.headline": 2,
  "reviews.quote": 5,
  "hours.headline": 2,
  "hours.description": 4,
  "hours.emergencyNotice": 3,
  "booking.headline": 2,
  "booking.description": 4,
  "footer.description": 4,
  "footer.medicalDisclaimer": 4,
};

export const FIELD_MAX_HEIGHTS: Record<string, number> = {
  "hero.headline": 140,
  "hero.subheadline": 160,
  "hero.badge": 44,
  "hero.primaryCta": 48,
  "hero.secondaryCta": 48,
  "whyUs.headline": 120,
  "whyUs.description": 140,
  "whyUs.pillars.description": 120,
  "services.headline": 120,
  "services.description": 140,
  "services.description_card": 130,
  "doctors.description": 130,
  "reviews.quote": 160,
  "hours.description": 140,
  "hours.emergencyNotice": 100,
  "booking.description": 140,
  "footer.description": 140,
  "footer.medicalDisclaimer": 140,
};

// -------------------------------------------------------------
// TEMPLATE PRESET 1: Care Standard (General Hospital / Clinic)
// -------------------------------------------------------------
export const DEFAULT_CLINIC_DATA: LandingPageData = {
  id: "harborview-clinic",
  name: "Harborview Medical Center",
  clientName: "Harborview Health Group",
  templateId: "tpl-community-clinic",
  theme: "emerald",
  status: "draft",
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "sec-navbar",
      type: "navbar",
      enabled: true,
      order: 0,
      data: {
        hospitalName: "Harborview Medical Center",
        tagline: "Community Healthcare Excellence",
        emergencyPhone: "+1 (800) 427-2673",
        ctaText: "Book Appointment",
        links: [
          { label: "About", href: "#why-us" },
          { label: "Services", href: "#services" },
          { label: "Doctors", href: "#doctors" },
          { label: "Reviews", href: "#reviews" },
          { label: "Hours", href: "#hours" },
          { label: "Contact", href: "#booking" },
        ],
      } as NavbarSectionData,
    },
    {
      id: "sec-hero",
      type: "hero",
      enabled: true,
      order: 1,
      data: {
        badge: "Trusted Community Healthcare since 2004",
        headline: "Comprehensive Care Close to Home.",
        subheadline:
          "Compassionate, high-precision medical care backed by board-certified specialists, state-of-the-art diagnostic imaging, and 24/7 urgent support.",
        primaryCta: "Schedule a Consultation",
        secondaryCta: "Explore Specialties",
        trustSnippet: "Accepting all major insurance providers · Same-day walk-ins welcome",
      } as HeroSectionData,
    },
    {
      id: "sec-stats",
      type: "stats",
      enabled: true,
      order: 2,
      data: {
        headline: "Two decades of clinical excellence in numbers.",
        items: [
          { id: "stat-1", value: "22+", label: "Years of Service", subtext: "Serving Puget Sound families" },
          { id: "stat-2", value: "48", label: "Specialist Physicians", subtext: "Board-certified doctors" },
          { id: "stat-3", value: "99.4%", label: "Patient Satisfaction", subtext: "Verified post-visit surveys" },
          { id: "stat-4", value: "140K+", label: "Patients Treated", subtext: "Outpatient & urgent care" },
        ],
      } as StatsSectionData,
    },
    {
      id: "sec-why-us",
      type: "why_us",
      enabled: true,
      order: 3,
      data: {
        eyebrow: "Why Choose Harborview",
        headline: "Patient-First Medicine with Clear, Transparent Care.",
        description: "We combine university-hospital expertise with the warmth and personal attention of your neighborhood clinic.",
        pillars: [
          { id: "pil-1", iconName: "ShieldCheck", title: "Board-Certified Specialists", description: "Every department is led by experienced physicians dedicated to evidence-based treatment plans." },
          { id: "pil-2", iconName: "Clock", title: "Zero Long Waiting Times", description: "Streamlined digital check-in and dedicated urgent care slots so you receive attention when it matters most." },
          { id: "pil-3", iconName: "Sparkles", title: "Advanced On-Site Lab & Imaging", description: "Digital X-ray, low-dose CT, ultrasound, and rapid bloodwork results delivered within the same visit." },
        ],
      } as WhyUsSectionData,
    },
    {
      id: "sec-services",
      type: "services",
      enabled: true,
      order: 4,
      data: {
        eyebrow: "Clinical Departments",
        headline: "Specialized Medical Services Under One Roof.",
        description: "From preventive family wellness to complex cardiovascular and orthopedic interventions.",
        services: [
          { id: "srv-1", iconName: "HeartPulse", name: "Cardiovascular Care", badge: "Specialized Center", description: "Comprehensive cardiac diagnostics, stress testing, echocardiograms, and preventive hypertension management.", highlights: ["ECG & 24hr Holter", "Echocardiography", "Hypertension Clinic"] },
          { id: "srv-2", iconName: "Stethoscope", name: "Primary & Family Medicine", badge: "All Ages", description: "Routine physicals, chronic disease management, pediatric checkups, and annual health screenings.", highlights: ["Annual Screenings", "Immunizations", "Diabetes Care"] },
          { id: "srv-3", iconName: "Activity", name: "Orthopedics & Sports Rehab", badge: "Rapid Recovery", description: "Joint preservation, minimally invasive arthroscopy, fracture care, and physical rehabilitation.", highlights: ["Joint Therapy", "Fracture Care", "Sports Injury Rehab"] },
        ],
      } as ServicesSectionData,
    },
    {
      id: "sec-doctors",
      type: "doctors",
      enabled: true,
      order: 5,
      data: {
        eyebrow: "Medical Leadership",
        headline: "Meet Our Dedicated Specialists.",
        description: "Experienced, compassionate physicians who treat you like family.",
        doctors: [
          { id: "doc-1", name: "Dr. Eleanor Vance, MD", role: "Chief of Cardiology", credentials: "Harvard Medical School · FACC", experience: "16+ Years Clinical Practice" },
          { id: "doc-2", name: "Dr. Marcus Thorne, MD", role: "Lead Orthopedic Surgeon", credentials: "Johns Hopkins Medicine · FAAOS", experience: "14+ Years Clinical Practice" },
          { id: "doc-3", name: "Dr. Maya Patel, MD", role: "Director of Pediatrics", credentials: "Stanford Medicine · FAAP", experience: "12+ Years Clinical Practice" },
        ],
      } as DoctorsSectionData,
    },
    {
      id: "sec-reviews",
      type: "reviews",
      enabled: true,
      order: 6,
      data: {
        eyebrow: "Patient Feedback",
        headline: "Real Stories from Patients We've Cared For.",
        description: "Read verified feedback from individuals and families in our community.",
        ratingAverage: "4.9",
        totalReviews: "1,420+",
        reviews: [
          { id: "rev-1", patientName: "Robert C.", treatment: "Cardiology Patient", rating: 5, quote: "Dr. Vance took time to explain my cardiac imaging results clearly. The staff was prompt and comforting.", date: "2 weeks ago" },
          { id: "rev-2", patientName: "Sarah M.", treatment: "Family Medicine", rating: 5, quote: "Our entire family visits Harborview. The online booking and check-in system saved us so much waiting time.", date: "1 month ago" },
          { id: "rev-3", patientName: "David L.", treatment: "Orthopedics", rating: 5, quote: "Had me back running in 8 weeks after a meniscus tear. Highly skilled physical therapy team on-site.", date: "3 weeks ago" },
        ],
      } as ReviewsSectionData,
    },
    {
      id: "sec-hours",
      type: "hours",
      enabled: true,
      order: 7,
      data: {
        eyebrow: "Clinic Schedule",
        headline: "Operating Hours & Emergency Triage.",
        description: "Convenient morning, evening, and weekend appointments designed around working families.",
        emergencyNotice: "Urgent care & triage physician available 24/7. Walk-ins prioritized for critical symptoms.",
        emergencyHotline: "+1 (800) 427-2673",
        schedule: [
          { day: "Monday – Friday", hours: "7:30 AM – 7:30 PM" },
          { day: "Saturday", hours: "8:30 AM – 4:30 PM" },
          { day: "Sunday", hours: "9:00 AM – 2:00 PM (Urgent Care Only)" },
        ],
      } as HoursSectionData,
    },
    {
      id: "sec-booking",
      type: "booking",
      enabled: true,
      order: 8,
      data: {
        eyebrow: "Get in Touch",
        headline: "Schedule Your Appointment Today.",
        description: "Request an appointment online in under 60 seconds or reach out to our front desk directly.",
        address: "742 Evergreen Parkway, Suite 300",
        cityState: "Seattle, WA 98101",
        phone: "+1 (206) 555-0198",
        email: "care@harborviewhealth.org",
        formTitle: "Request an Appointment",
        departments: ["Cardiology", "Primary & Family Care", "Orthopedics & Rehab", "Pediatrics", "Diagnostic Imaging"],
      } as BookingSectionData,
    },
    {
      id: "sec-footer",
      type: "footer",
      enabled: true,
      order: 9,
      data: {
        hospitalName: "Harborview Medical Center",
        description: "Providing world-class medical diagnosis, urgent intervention, and personalized family wellness across greater Seattle.",
        accreditationBadge: "JCAHO Accredited · State Department of Health Certified",
        phone: "+1 (206) 555-0198",
        email: "contact@harborviewhealth.org",
        address: "742 Evergreen Parkway, Suite 300, Seattle, WA",
        quickLinks: [
          { label: "Clinical Specialties", href: "#services" },
          { label: "Specialist Physicians", href: "#doctors" },
          { label: "Patient Reviews", href: "#reviews" },
          { label: "Operating Hours", href: "#hours" },
          { label: "Schedule Appointment", href: "#booking" },
        ],
        medicalDisclaimer: "Medical Disclaimer: The medical information on this site is provided as an information resource only, and is not to be used or relied on for any diagnostic or treatment purposes. If you are experiencing a life-threatening medical emergency, call 911 immediately.",
        copyrightText: "© 2026 Harborview Medical Center. All rights reserved.",
      } as FooterSectionData,
    },
  ],
};

// -------------------------------------------------------------
// TEMPLATE PRESET 2: Dental & Orthodontics Center
// -------------------------------------------------------------
export const DENTAL_CLINIC_DATA: LandingPageData = {
  id: "beacon-hill-dental",
  name: "Beacon Hill Dental & Orthodontics",
  clientName: "Beacon Dental Care LLC",
  templateId: "tpl-dental",
  theme: "navy",
  status: "draft",
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "sec-navbar",
      type: "navbar",
      enabled: true,
      order: 0,
      data: {
        hospitalName: "Beacon Hill Dental",
        tagline: "Modern Cosmetic & Family Dentistry",
        emergencyPhone: "+1 (800) 555-3368",
        ctaText: "Book Dental Exam",
        links: [
          { label: "About", href: "#why-us" },
          { label: "Treatments", href: "#services" },
          { label: "Dentists", href: "#doctors" },
          { label: "Reviews", href: "#reviews" },
          { label: "Hours", href: "#hours" },
          { label: "Contact", href: "#booking" },
        ],
      } as NavbarSectionData,
    },
    {
      id: "sec-hero",
      type: "hero",
      enabled: true,
      order: 1,
      data: {
        badge: "Advanced Pain-Free Laser Dentistry",
        headline: "Confidence Begins with a Healthy Smile.",
        subheadline:
          "Gentle family checkups, Invisalign orthodontics, and same-day dental crowns powered by 3D digital imaging.",
        primaryCta: "Book New Patient Exam",
        secondaryCta: "Explore Treatments",
        trustSnippet: "In-network with Delta Dental, Cigna, MetLife · Flexible 0% financing",
      } as HeroSectionData,
    },
    {
      id: "sec-stats",
      type: "stats",
      enabled: true,
      order: 2,
      data: {
        headline: "Creating beautiful, healthy smiles for over 15 years.",
        items: [
          { id: "stat-1", value: "15+", label: "Years in Practice", subtext: "Trusted local dentistry" },
          { id: "stat-2", value: "8,500+", label: "Invisalign Cases", subtext: "VIP Diamond Provider" },
          { id: "stat-3", value: "99.8%", label: "Comfort Rating", subtext: "Pain-free patient feedback" },
          { id: "stat-4", value: "0%", label: "Interest Financing", subtext: "CareCredit available" },
        ],
      } as StatsSectionData,
    },
    {
      id: "sec-why-us",
      type: "why_us",
      enabled: true,
      order: 3,
      data: {
        eyebrow: "Why Choose Beacon Dental",
        headline: "Gentle, Anxiety-Free Dentistry Designed for You.",
        description: "We believe visiting the dentist should be relaxed, transparent, and completely pain-free.",
        pillars: [
          { id: "pil-1", iconName: "Sparkles", title: "3D Digital Scanning (No Goo)", description: "Instant digital impression scans replace messy traditional impression trays." },
          { id: "pil-2", iconName: "ShieldCheck", title: "Same-Day Ceramic Crowns", description: "In-office CEREC milling delivers durable porcelain crowns in a single visit." },
          { id: "pil-3", iconName: "Clock", title: "Emergency Dental Relief", description: "Same-day toothache relief, broken tooth repair, and urgent appointments." },
        ],
      } as WhyUsSectionData,
    },
    {
      id: "sec-services",
      type: "services",
      enabled: true,
      order: 4,
      data: {
        eyebrow: "Dental Treatments",
        headline: "Comprehensive Oral Healthcare for Every Age.",
        description: "From routine hygiene cleanings to complete smile makeovers and dental implants.",
        services: [
          { id: "srv-1", iconName: "Activity", name: "Invisalign Clear Aligners", badge: "Diamond Provider", description: "Straighten teeth discreetly in 6–12 months with removable clear aligners.", highlights: ["Free 3D Simulation", "Discreet Trays", "Fast Results"] },
          { id: "srv-2", iconName: "Stethoscope", name: "Preventive Hygiene & Cleanings", badge: "Routine Care", description: "Ultrasonic tartar removal, fluoride treatments, and gentle oral cancer screenings.", highlights: ["Ultrasonic Cleaning", "Oral Screening", "Fluoride Care"] },
          { id: "srv-3", iconName: "Sparkles", name: "Dental Implants & Restorations", badge: "Permanent Solution", description: "Titanium implants that look, feel, and function exactly like natural teeth.", highlights: ["3D Guided Placement", "Lifetime Guarantee", "Natural Feel"] },
        ],
      } as ServicesSectionData,
    },
    {
      id: "sec-doctors",
      type: "doctors",
      enabled: true,
      order: 5,
      data: {
        eyebrow: "Dental Leadership",
        headline: "Meet Our Experienced Dentists & Orthodontists.",
        description: "Caring clinicians committed to gentle, empathetic dental wellness.",
        doctors: [
          { id: "doc-1", name: "Dr. Julian Vance, DDS", role: "Lead Cosmetic Dentist", credentials: "NYU College of Dentistry · AACD", experience: "15+ Years Experience" },
          { id: "doc-2", name: "Dr. Sarah Lin, DMD", role: "Orthodontic Specialist", credentials: "UPenn Dental Medicine · ABO Certified", experience: "11+ Years Experience" },
          { id: "doc-3", name: "Dr. Kevin Brooks, DDS", role: "Oral Surgeon & Implantologist", credentials: "UCLA School of Dentistry · AAOMS", experience: "13+ Years Experience" },
        ],
      } as DoctorsSectionData,
    },
    {
      id: "sec-reviews",
      type: "reviews",
      enabled: true,
      order: 6,
      data: {
        eyebrow: "Patient Feedback",
        headline: "What Patients Say About Their Beacon Dental Visits.",
        description: "Over 900 five-star reviews on Google and Healthgrades.",
        ratingAverage: "4.95",
        totalReviews: "940+",
        reviews: [
          { id: "rev-1", patientName: "Amanda K.", treatment: "Invisalign Treatment", rating: 5, quote: "Finished my Invisalign in 9 months! Dr. Lin made every checkup quick and painless.", date: "1 week ago" },
          { id: "rev-2", patientName: "Thomas B.", treatment: "Same-Day Crown", rating: 5, quote: "Walked in with a cracked molar and walked out 90 minutes later with a permanent ceramic crown.", date: "3 weeks ago" },
          { id: "rev-3", patientName: "Elena G.", treatment: "Family Cleanings", rating: 5, quote: "Brought both of my kids here. The hygienists are so kind and patient with little ones.", date: "1 month ago" },
        ],
      } as ReviewsSectionData,
    },
    {
      id: "sec-hours",
      type: "hours",
      enabled: true,
      order: 7,
      data: {
        eyebrow: "Office Schedule",
        headline: "Flexible Hours for Busy Schedules.",
        description: "Early morning and evening appointments so you never have to miss work or school.",
        emergencyNotice: "Severe toothache or dental trauma? Call our emergency hotline for immediate same-day relief.",
        emergencyHotline: "+1 (800) 555-3368",
        schedule: [
          { day: "Monday – Thursday", hours: "7:00 AM – 6:00 PM" },
          { day: "Friday", hours: "7:00 AM – 4:00 PM" },
          { day: "Saturday", hours: "8:00 AM – 1:00 PM (By Appointment)" },
        ],
      } as HoursSectionData,
    },
    {
      id: "sec-booking",
      type: "booking",
      enabled: true,
      order: 8,
      data: {
        eyebrow: "Online Booking",
        headline: "Book Your Dental Visit in Under 60 Seconds.",
        description: "Select your preferred treatment and our scheduling coordinator will confirm your visit.",
        address: "1200 Beacon Boulevard, Suite 210",
        cityState: "Boston, MA 02108",
        phone: "+1 (617) 555-0144",
        email: "appointments@beacondental.com",
        formTitle: "Schedule Dental Appointment",
        departments: ["New Patient Exam & Cleaning", "Invisalign Consultation", "Emergency Dental Care", "Teeth Whitening & Aesthetics", "Dental Implants"],
      } as BookingSectionData,
    },
    {
      id: "sec-footer",
      type: "footer",
      enabled: true,
      order: 9,
      data: {
        hospitalName: "Beacon Hill Dental",
        description: "Providing modern, gentle, and pain-free dentistry for families across greater Boston.",
        accreditationBadge: "ADA Member · American Academy of Cosmetic Dentistry",
        phone: "+1 (617) 555-0144",
        email: "hello@beacondental.com",
        address: "1200 Beacon Boulevard, Suite 210, Boston, MA",
        quickLinks: [
          { label: "Treatments", href: "#services" },
          { label: "Our Dentists", href: "#doctors" },
          { label: "Patient Reviews", href: "#reviews" },
          { label: "Office Hours", href: "#hours" },
          { label: "Book Appointment", href: "#booking" },
        ],
        medicalDisclaimer: "Dental Disclaimer: The information provided on this website is for general informational purposes only and does not constitute formal dental advice. Always consult a licensed dentist for personalized diagnosis.",
        copyrightText: "© 2026 Beacon Hill Dental Care LLC. All rights reserved.",
      } as FooterSectionData,
    },
  ],
};

// -------------------------------------------------------------
// TEMPLATE PRESET 3: Specialist Orthopedic & Sports Medicine
// -------------------------------------------------------------
export const ORTHO_CLINIC_DATA: LandingPageData = {
  id: "cascade-health-hub",
  name: "Cascade Orthopedics & Sports Medicine",
  clientName: "Cascade Health Network",
  templateId: "tpl-specialist-clinic",
  theme: "teal",
  status: "draft",
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "sec-navbar",
      type: "navbar",
      enabled: true,
      order: 0,
      data: {
        hospitalName: "Cascade Orthopedics",
        tagline: "Sports Medicine & Joint Care",
        emergencyPhone: "+1 (800) 449-7678",
        ctaText: "Book Specialist Exam",
        links: [
          { label: "About", href: "#why-us" },
          { label: "Specialties", href: "#services" },
          { label: "Surgeons", href: "#doctors" },
          { label: "Reviews", href: "#reviews" },
          { label: "Hours", href: "#hours" },
          { label: "Contact", href: "#booking" },
        ],
      } as NavbarSectionData,
    },
    {
      id: "sec-hero",
      type: "hero",
      enabled: true,
      order: 1,
      data: {
        badge: "Leading Sports Medicine & Joint Preservation",
        headline: "Restoring Mobility. Rebuilding Strength.",
        subheadline:
          "Minimally invasive joint surgery, spine care, and integrated physical rehabilitation to get you back to active living.",
        primaryCta: "Schedule Specialist Consult",
        secondaryCta: "Explore Specialties",
        trustSnippet: "Official sports medicine partner for collegiate and regional athletes",
      } as HeroSectionData,
    },
    {
      id: "sec-stats",
      type: "stats",
      enabled: true,
      order: 2,
      data: {
        headline: "Setting the standard for orthopedic surgical excellence.",
        items: [
          { id: "stat-1", value: "18K+", label: "Successful Surgeries", subtext: "99.2% complication-free" },
          { id: "stat-2", value: "12", label: "Sub-Specialist Surgeons", subtext: "Fellowship-trained" },
          { id: "stat-3", value: "98.7%", label: "Mobility Recovery Rate", subtext: "Verified outcomes" },
          { id: "stat-4", value: "Same-Day", label: "Outpatient Discharge", subtext: "Minimally invasive care" },
        ],
      } as StatsSectionData,
    },
    {
      id: "sec-why-us",
      type: "why_us",
      enabled: true,
      order: 3,
      data: {
        eyebrow: "Why Choose Cascade",
        headline: "Advanced Surgical Precision Combined with Dedicated Rehab.",
        description: "From diagnosis to final physical therapy milestone, our care team guides every step of your recovery.",
        pillars: [
          { id: "pil-1", iconName: "ShieldCheck", title: "Fellowship-Trained Surgeons", description: "Sub-specialized in knee, hip, shoulder, spine, and foot/ankle reconstruction." },
          { id: "pil-2", iconName: "Activity", title: "Minimally Invasive Arthroscopy", description: "Smaller incisions, minimal tissue disruption, and dramatically faster recovery timelines." },
          { id: "pil-3", iconName: "Clock", title: "On-Site Physical Therapy Gym", description: "Dedicated orthopedic therapists collaborating directly with your operating surgeon." },
        ],
      } as WhyUsSectionData,
    },
    {
      id: "sec-services",
      type: "services",
      enabled: true,
      order: 4,
      data: {
        eyebrow: "Clinical Specialties",
        headline: "Targeted Orthopedic Solutions for Joint & Bone Health.",
        description: "Comprehensive non-surgical management and robotic-assisted surgical interventions.",
        services: [
          { id: "srv-1", iconName: "Activity", name: "Robotic Joint Replacement", badge: "Mako Robotics", description: "Custom-aligned total and partial knee and hip replacements for maximum longevity.", highlights: ["Robotic Alignment", "Rapid Recovery", "Outpatient Option"] },
          { id: "srv-2", iconName: "Stethoscope", name: "Sports Injury & ACL Repair", badge: "Athletic Care", description: "Arthroscopic ligament reconstruction, meniscus preservation, and rotator cuff repair.", highlights: ["ACL Reconstruction", "Rotator Cuff Repair", "Return-to-Play Testing"] },
          { id: "srv-3", iconName: "Sparkles", name: "Spine & Pain Management", badge: "Non-Surgical Focus", description: "Epidural injections, physical therapy, and micro-decompression for back and neck pain.", highlights: ["Targeted Injections", "Disc Preservation", "Posture Therapy"] },
        ],
      } as ServicesSectionData,
    },
    {
      id: "sec-doctors",
      type: "doctors",
      enabled: true,
      order: 5,
      data: {
        eyebrow: "Surgical Leadership",
        headline: "Meet Our Fellowship-Trained Orthopedic Surgeons.",
        description: "Nationally recognized leaders in sports medicine and joint preservation.",
        doctors: [
          { id: "doc-1", name: "Dr. Alexander Sterling, MD", role: "Head of Joint Reconstruction", credentials: "Stanford Medicine · Fellowship at Mayo Clinic", experience: "17+ Years Experience" },
          { id: "doc-2", name: "Dr. Rachel Chen, MD", role: "Director of Sports Medicine", credentials: "Harvard Medical School · AOSSM Member", experience: "14+ Years Experience" },
          { id: "doc-3", name: "Dr. Daniel Harris, MD", role: "Spine & Neck Specialist", credentials: "Columbia University · NASS Certified", experience: "15+ Years Experience" },
        ],
      } as DoctorsSectionData,
    },
    {
      id: "sec-reviews",
      type: "reviews",
      enabled: true,
      order: 6,
      data: {
        eyebrow: "Patient Outcomes",
        headline: "Stories of Recovery and Restored Mobility.",
        description: "Hear how patients got back to hiking, running, and pain-free living.",
        ratingAverage: "4.92",
        totalReviews: "1,180+",
        reviews: [
          { id: "rev-1", patientName: "Marcus P.", treatment: "ACL Reconstruction", rating: 5, quote: "Tore my ACL skiing. Dr. Chen performed my surgery and the Cascade PT team had me back on my skis the next season.", date: "1 month ago" },
          { id: "rev-2", patientName: "Barbara W.", treatment: "Total Hip Replacement", rating: 5, quote: "I lived with hip pain for 4 years. Dr. Sterling's robotic surgery changed my life. I was walking the next morning.", date: "2 months ago" },
          { id: "rev-3", patientName: "Jason T.", treatment: "Rotator Cuff Repair", rating: 5, quote: "Full shoulder range of motion restored in 4 months. True surgical masters.", date: "3 weeks ago" },
        ],
      } as ReviewsSectionData,
    },
    {
      id: "sec-hours",
      type: "hours",
      enabled: true,
      order: 7,
      data: {
        eyebrow: "Clinic Schedule",
        headline: "Consultation & Physical Therapy Hours.",
        description: "Early morning physical therapy sessions available for working patients.",
        emergencyNotice: "Acute fractures or sports injuries? Walk into our Urgent Ortho Triage without a referral.",
        emergencyHotline: "+1 (800) 449-7678",
        schedule: [
          { day: "Monday – Friday", hours: "6:30 AM – 6:30 PM (PT & Consults)" },
          { day: "Saturday", hours: "8:00 AM – 2:00 PM (Acute Injury Clinic)" },
          { day: "Sunday", hours: "Closed" },
        ],
      } as HoursSectionData,
    },
    {
      id: "sec-booking",
      type: "booking",
      enabled: true,
      order: 8,
      data: {
        eyebrow: "Direct Scheduling",
        headline: "Schedule Your Orthopedic Consultation.",
        description: "No doctor referral required for most major insurance plans.",
        address: "880 Cascade Medical Way, Tower B",
        cityState: "Portland, OR 97201",
        phone: "+1 (503) 555-0182",
        email: "appointments@cascadeortho.org",
        formTitle: "Book Specialist Consultation",
        departments: ["Knee & Hip Joint Care", "Sports Medicine & Arthroscopy", "Shoulder & Elbow Clinic", "Spine & Back Pain", "Foot & Ankle Reconstruction"],
      } as BookingSectionData,
    },
    {
      id: "sec-footer",
      type: "footer",
      enabled: true,
      order: 9,
      data: {
        hospitalName: "Cascade Orthopedics",
        description: "Specialized joint preservation, robotic surgery, and dedicated sports medicine rehabilitation.",
        accreditationBadge: "AAOS Certified Center of Excellence · State Board Approved",
        phone: "+1 (503) 555-0182",
        email: "info@cascadeortho.org",
        address: "880 Cascade Medical Way, Tower B, Portland, OR",
        quickLinks: [
          { label: "Surgical Specialties", href: "#services" },
          { label: "Surgeons Roster", href: "#doctors" },
          { label: "Patient Outcomes", href: "#reviews" },
          { label: "Clinic Hours", href: "#hours" },
          { label: "Book Consultation", href: "#booking" },
        ],
        medicalDisclaimer: "Orthopedic Disclaimer: Content on this website is for educational purposes. Consult an orthopedic specialist for clinical examination and personalized surgical recommendations.",
        copyrightText: "© 2026 Cascade Orthopedics & Sports Medicine Network. All rights reserved.",
      } as FooterSectionData,
    },
  ],
};

export const TEMPLATES_DICTIONARY: Record<string, LandingPageData> = {
  "tpl-community-clinic": DEFAULT_CLINIC_DATA,
  "care-standard": DEFAULT_CLINIC_DATA,
  "tpl-dental": DENTAL_CLINIC_DATA,
  "specialist-clinic": ORTHO_CLINIC_DATA,
  "tpl-specialist-clinic": ORTHO_CLINIC_DATA,
  "wellness-modern": DEFAULT_CLINIC_DATA,
};
