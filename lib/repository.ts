import { randomUUID } from "node:crypto";
import {
  initialDeployments,
  initialDomains,
  initialWebsites,
  sampleContent,
  summarizeWebsite,
  templates,
} from "./data";
import { DEFAULT_CLINIC_DATA, TEMPLATES_DICTIONARY } from "./builder-types";
import {
  saveUserWebsite,
  deleteUserWebsite,
} from "./firebase-service";
import type {
  ClinicContent,
  Deployment,
  DomainConnection,
  Template,
  Website,
  WebsiteSummary,
} from "./types";
import type { LandingPageData } from "./builder-types";

export type WebsiteDraftUpdate = {
  name?: string;
  clientName?: string;
  templateId?: string;
  content?: ClinicContent;
  landingPageData?: LandingPageData;
};

export interface FactoryRepository {
  listWebsites(userId?: string): WebsiteSummary[];
  getWebsite(id: string, userId?: string): Website;
  upsertWebsite(website: Website, userId?: string): Website;
  createWebsite(input: { name: string; clientName: string; templateId: string; userId?: string }): Website;
  updateDraft(id: string, input: WebsiteDraftUpdate, userId?: string): Website | undefined;
  updateApproval(id: string, approved: boolean, userId?: string): Website | undefined;
  publish(id: string, deployment: Deployment, userId?: string): Website | undefined;
  setDomain(id: string, domain: string, userId?: string): Website | undefined;
  deleteWebsite(id: string, userId?: string): boolean;
  listTemplates(): Template[];
  listDeployments(userId?: string): Deployment[];
  listDomains(userId?: string): DomainConnection[];
  saveDomain(input: DomainConnection, userId?: string): DomainConnection;
}

// Ensure in-memory state persists across Next.js hot reloads in development
const globalStore = globalThis as unknown as {
  __factory_websites?: Website[];
  __factory_deployments?: Deployment[];
  __factory_domains?: DomainConnection[];
};

if (!globalStore.__factory_websites) {
  globalStore.__factory_websites = [...initialWebsites];
}
if (!globalStore.__factory_deployments) {
  globalStore.__factory_deployments = [...initialDeployments];
}
if (!globalStore.__factory_domains) {
  globalStore.__factory_domains = [...initialDomains];
}

const websites = globalStore.__factory_websites;
const deployments = globalStore.__factory_deployments;
const domains = globalStore.__factory_domains;

export class DemoFactoryRepository implements FactoryRepository {
  listWebsites(userId?: string) {
    if (userId) {
      return websites
        .filter((w) => w.userId === userId || (!w.userId && userId === "usr_dev_workspace"))
        .map(summarizeWebsite);
    }
    return websites.map(summarizeWebsite);
  }

  getWebsite(id: string, userId?: string): Website {
    let website = websites.find((w) => w.id === id);
    if (!website) {
      // Auto-recover or create if server reloaded
      const formattedName =
        id
          .replace(/-[a-f0-9]{4,8}$/i, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()) || "Custom Clinic";

      const pageData: LandingPageData = structuredClone(DEFAULT_CLINIC_DATA);
      pageData.id = id;
      pageData.name = formattedName;
      pageData.clientName = `${formattedName} Client`;

      website = {
        id,
        userId: userId || "usr_dev_workspace",
        name: formattedName,
        clientName: `${formattedName} Client`,
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
        landingPageData: pageData,
      };
      website.draft.hospitalName = formattedName;
      websites.unshift(website);
    }

    if (userId && !website.userId) {
      website.userId = userId;
    }

    if (!website.landingPageData) {
      const templateSeed = TEMPLATES_DICTIONARY[website.templateId] || DEFAULT_CLINIC_DATA;
      const pageData: LandingPageData = structuredClone(templateSeed);
      pageData.id = website.id;
      pageData.name = website.name;
      pageData.clientName = website.clientName;
      website.landingPageData = pageData;
    }
    return website;
  }

  upsertWebsite(website: Website, userId?: string): Website {
    if (userId && !website.userId) {
      website.userId = userId;
    }
    const existingIndex = websites.findIndex((w) => w.id === website.id);
    if (existingIndex >= 0) {
      websites[existingIndex] = website;
    } else {
      websites.unshift(website);
    }
    return website;
  }

  createWebsite(input: { name: string; clientName: string; templateId: string; userId?: string }) {
    const template = templates.find((item) => item.id === input.templateId) ?? templates[0];
    const newId = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "website"}-${randomUUID().slice(0, 6)}`;
    const effectiveUserId = input.userId || "usr_dev_workspace";

    // Pick niche-specific template data seed
    const templateSeed = TEMPLATES_DICTIONARY[input.templateId] || DEFAULT_CLINIC_DATA;
    const pageData: LandingPageData = structuredClone(templateSeed);
    pageData.id = newId;
    pageData.name = input.name;
    pageData.clientName = input.clientName;
    pageData.templateId = template.id;

    // Update navbar and footer with clinic name
    pageData.sections = pageData.sections.map((sec) => {
      if (sec.type === "navbar" && "hospitalName" in sec.data) {
        return { ...sec, data: { ...sec.data, hospitalName: input.name } };
      }
      if (sec.type === "footer" && "hospitalName" in sec.data) {
        return { ...sec, data: { ...sec.data, hospitalName: input.name } };
      }
      return sec;
    });

    const created: Website = {
      id: newId,
      userId: effectiveUserId,
      name: input.name,
      clientName: input.clientName,
      templateId: template.id,
      templateName: template.name,
      status: "draft",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      domain: null,
      previewUrl: `/api/websites/${newId}/preview`,
      draft: structuredClone(sampleContent),
      published: null,
      approvedAt: null,
      publishedAt: null,
      deploymentId: null,
      hostingerUid: null,
      landingPageData: pageData,
    };
    created.draft.hospitalName = input.name;
    created.draft.seo = {
      title: `${input.name} | Healthcare Excellence`,
      description: `Official portal for ${input.name}, providing specialized medical care.`,
    };
    websites.unshift(created);

    // Sync to Firebase Realtime Database asynchronously
    saveUserWebsite(effectiveUserId, created).catch((err) => {
      console.warn("[Repository] Firebase sync warning:", err);
    });

    return created;
  }

  updateDraft(id: string, input: WebsiteDraftUpdate, userId?: string) {
    const website = this.getWebsite(id, userId);
    if (!website) return undefined;
    if (userId && !website.userId) website.userId = userId;
    if (input.name) website.name = input.name;
    if (input.clientName) website.clientName = input.clientName;
    if (input.templateId) {
      const template = templates.find((item) => item.id === input.templateId);
      if (template) {
        website.templateId = template.id;
        website.templateName = template.name;
      }
    }
    if (input.content) website.draft = input.content;
    if (input.landingPageData) {
      website.landingPageData = input.landingPageData;
      website.name = input.landingPageData.name || website.name;
      website.clientName = input.landingPageData.clientName || website.clientName;
    }
    website.status = website.published ? "live" : "draft";
    website.updatedAt = new Date().toISOString();

    // Sync to Firebase Realtime Database
    const effectiveUserId = website.userId || userId || "usr_dev_workspace";
    saveUserWebsite(effectiveUserId, website).catch((err) => {
      console.warn("[Repository] Firebase sync warning:", err);
    });

    return website;
  }

  updateApproval(id: string, approved: boolean, userId?: string) {
    const website = this.getWebsite(id, userId);
    if (!website) return undefined;
    website.status = approved ? "approved" : "awaiting_approval";
    website.approvedAt = approved ? new Date().toISOString() : null;
    website.updatedAt = new Date().toISOString();

    const effectiveUserId = website.userId || userId || "usr_dev_workspace";
    saveUserWebsite(effectiveUserId, website).catch(() => {});

    return website;
  }

  publish(id: string, deployment: Deployment, userId?: string) {
    const website = this.getWebsite(id, userId);
    if (!website) return undefined;
    const effectiveUserId = website.userId || userId || "usr_dev_workspace";
    deployment.userId = effectiveUserId;
    website.published = structuredClone(website.draft);
    website.publishedAt = new Date().toISOString();
    website.deploymentId = deployment.id;
    website.previewUrl = deployment.url;
    website.status = deployment.status === "live" ? "live" : "published";
    website.updatedAt = new Date().toISOString();
    deployments.unshift(deployment);

    saveUserWebsite(effectiveUserId, website).catch(() => {});

    return website;
  }

  setDomain(id: string, domain: string, userId?: string) {
    const website = this.getWebsite(id, userId);
    if (!website) return undefined;
    website.domain = domain;
    website.previewUrl = `https://${domain}`;
    website.updatedAt = new Date().toISOString();

    const effectiveUserId = website.userId || userId || "usr_dev_workspace";
    saveUserWebsite(effectiveUserId, website).catch(() => {});

    return website;
  }

  deleteWebsite(id: string, userId?: string) {
    const index = websites.findIndex((w) => w.id === id);
    const site = index !== -1 ? websites[index] : null;
    if (index !== -1) {
      websites.splice(index, 1);
    }
    const effectiveUserId = site?.userId || userId || "usr_dev_workspace";
    deleteUserWebsite(effectiveUserId, id).catch(() => {});
    return true;
  }

  listTemplates() {
    return templates;
  }

  listDeployments(userId?: string) {
    if (userId) {
      return deployments.filter(
        (d) => d.userId === userId || (!d.userId && userId === "usr_dev_workspace")
      );
    }
    return deployments;
  }

  listDomains(userId?: string) {
    if (userId) {
      return domains.filter(
        (d) => d.userId === userId || (!d.userId && userId === "usr_dev_workspace")
      );
    }
    return domains;
  }

  saveDomain(input: DomainConnection, userId?: string) {
    if (userId) input.userId = userId;
    const existingIndex = domains.findIndex((domain) => domain.id === input.id);
    if (existingIndex >= 0) domains[existingIndex] = input;
    else domains.unshift(input);
    return input;
  }
}

export const repository: FactoryRepository = new DemoFactoryRepository();
