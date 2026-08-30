import type {
  ClinicContent,
  Deployment,
  DomainConnection,
  Template,
  Website,
  WebsiteSummary,
} from "./types";

export const templates: Template[] = [
  {
    id: "care-standard",
    name: "Care Standard Hospital",
    description: "A modern, responsive 10-section layout for general healthcare practices and multi-specialty medical centers.",
    category: "General Hospital",
    accent: "teal",
    sections: ["Header", "Hero", "Proof Metrics", "Why Us", "Clinical Services", "Physicians", "Patient Reviews", "Hours & Triage", "Booking Form", "Footer"],
  },
  {
    id: "tpl-dental",
    name: "Dental & Orthodontics",
    description: "Tailored for cosmetic dentistry, Invisalign orthodontics, and family dental checkup practices.",
    category: "Dental Care",
    accent: "violet",
    sections: ["Header", "Hero", "Proof Metrics", "Why Us", "Dental Treatments", "Dentists Roster", "Patient Reviews", "Office Hours", "Booking Form", "Footer"],
  },
  {
    id: "specialist-clinic",
    name: "Orthopedic & Sports Medicine",
    description: "High-trust surgical and outpatient clinic layout for sports rehabilitation, joint care, and spine clinics.",
    category: "Specialist Surgery",
    accent: "teal",
    sections: ["Header", "Hero", "Proof Metrics", "Why Us", "Surgical Specialties", "Surgeons Roster", "Outcomes", "Schedule", "Consult Booking", "Footer"],
  },
  {
    id: "wellness-modern",
    name: "Pediatric & Family Wellness",
    description: "Warm, compassionate layout for pediatric clinics, family health centers, and preventative wellness.",
    category: "Pediatrics & Family",
    accent: "amber",
    sections: ["Header", "Hero", "Proof Metrics", "Why Us", "Care Departments", "Pediatricians", "Parent Reviews", "Hours", "Visit Booking", "Footer"],
  },
  {
    id: "diagnostics-modern",
    name: "Diagnostics & Imaging Center",
    description: "Precision layout for radiology, MRI/CT scanning labs, pathology testing, and clinical diagnostics.",
    category: "Diagnostics & Lab",
    accent: "coral",
    sections: ["Header", "Hero", "Proof Metrics", "Why Us", "Lab Services", "Radiologists", "Patient Reviews", "Lab Hours", "Scan Booking", "Footer"],
  },
];

export const sampleContent: ClinicContent = {
  hospitalName: "Harborview Medical Center",
  tagline: "Community Healthcare Excellence",
  location: "Seattle, WA",
  logoUrl: null,
  heroImageUrl: null,
  heroTitle: "Comprehensive Care Close to Home.",
  heroBody:
    "A modern multi-specialty centre built around clear guidance, experienced clinicians, and a calmer patient experience.",
  aboutTitle: "A better way to feel looked after",
  aboutBody:
    "From your first question to your follow-up, our teams make space for the whole person. We combine specialist expertise with practical, personal support for every step of your care.",
  stats: [
    { value: "22+", label: "Years of service" },
    { value: "48", label: "Specialists" },
    { value: "4.9/5", label: "Patient rating" },
  ],
  services: [
    { name: "Multi-specialty care", description: "Coordinated support from experienced specialists under one roof.", icon: "activity" },
    { name: "Diagnostics", description: "Clear, timely testing with results explained in plain language.", icon: "activity" },
    { name: "Preventive health", description: "Personalized plans that help you stay ahead of what matters.", icon: "activity" },
  ],
  doctors: [
    { name: "Dr. Eleanor Vance, MD", specialty: "Cardiology", initials: "EV", imageUrl: null },
    { name: "Dr. Marcus Thorne, MD", specialty: "Orthopedics", initials: "MT", imageUrl: null },
    { name: "Dr. Maya Patel, MD", specialty: "Pediatrics", initials: "MP", imageUrl: null },
  ],
  contact: {
    phone: "+1 (206) 555-0198",
    email: "care@harborviewhealth.org",
    address: "742 Evergreen Parkway, Seattle, WA 98101",
    hours: "Mon–Fri: 7:30am–7:30pm, Sat: 8:30am–4:30pm",
  },
  seo: {
    title: "Harborview Medical Center | Healthcare Excellence",
    description: "Official portal for Harborview Medical Center, providing specialist care and primary medical services.",
  },
};

export const initialWebsites: Website[] = [];

export const initialDeployments: Deployment[] = [];

export const initialDomains: DomainConnection[] = [];

export function summarizeWebsite(website: Website): WebsiteSummary {
  return {
    id: website.id,
    name: website.name,
    clientName: website.clientName,
    templateName: website.templateName,
    status: website.status,
    updatedAt: website.updatedAt,
    domain: website.domain,
    previewUrl: website.previewUrl,
  };
}
