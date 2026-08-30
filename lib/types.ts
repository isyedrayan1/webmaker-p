import type { LandingPageData } from "./builder-types";

export type ProjectStatus =
  | "draft"
  | "awaiting_approval"
  | "approved"
  | "published"
  | "live";

export type DeploymentStatus = "queued" | "building" | "deploying" | "live" | "failed";

export type DomainStatus = "connected" | "verifying" | "instructions" | "failed";

export interface ClinicContent {
  hospitalName: string;
  tagline: string;
  location: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  heroTitle: string;
  heroBody: string;
  aboutTitle?: string;
  aboutBody?: string;
  stats: { value: string; label: string }[];
  services: { name: string; description: string; icon?: string }[];
  doctors?: { name: string; specialty: string; initials?: string; imageUrl?: string | null }[];
  contact?: { phone?: string; email?: string; address?: string; hours?: string };
  seo?: { title: string; description: string };
}

export interface Website {
  id: string;
  name: string;
  clientName: string;
  templateId: string;
  templateName: string;
  status: ProjectStatus;
  updatedAt: string;
  domain?: string | null;
  previewUrl?: string | null;
  draft: ClinicContent;
  published?: ClinicContent | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
  deploymentId?: string | null;
  hostingerUid?: string | null;
  landingPageData?: LandingPageData | null;
}

export interface WebsiteSummary {
  id: string;
  name: string;
  clientName: string;
  templateId?: string;
  templateName: string;
  status: ProjectStatus;
  updatedAt: string;
  domain?: string | null;
  previewUrl?: string | null;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: "teal" | "amber" | "coral" | "violet";
  sections: string[];
}

export interface Deployment {
  id: string;
  websiteId: string;
  websiteName: string;
  status: DeploymentStatus;
  mode: "mock" | "hostinger";
  url?: string;
  createdAt: string;
  finishedAt?: string;
  completedAt?: string;
  message?: string;
  target?: string;
  templateName?: string;
  filesCount?: number;
  sizeKb?: number;
  domain?: string;
}

export interface DomainConnection {
  id: string;
  websiteId: string;
  websiteName: string;
  domain: string;
  provider: string;
  status: DomainStatus;
  instructions: string[];
  verifiedAt?: string | null;
}
