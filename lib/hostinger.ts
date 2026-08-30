import type { Deployment, DomainConnection, Website } from "./types";
import { buildStaticArchive } from "./static-site";

const apiBase = "https://developers.hostinger.com";

type HostingerConfig = {
  token: string;
  orderId: string;
  datacenterCode: string;
  phpVersion: string;
};

const config: HostingerConfig | null =
  process.env.HOSTINGER_API_TOKEN && process.env.HOSTINGER_ORDER_ID
    ? {
        token: process.env.HOSTINGER_API_TOKEN,
        orderId: process.env.HOSTINGER_ORDER_ID,
        datacenterCode: process.env.HOSTINGER_DATACENTER_CODE ?? "us-east",
        phpVersion: process.env.HOSTINGER_PHP_VERSION ?? "8.3",
      }
    : null;

const headers = () => ({
  Authorization: `Bearer ${config?.token ?? ""}`,
  "Content-Type": "application/json",
});

async function hostingerFetch(path: string, init?: RequestInit) {
  if (!config) throw new Error("Hostinger credentials are not configured.");
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  const body = await response.text();
  let data: unknown = {};
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    data = { raw: body };
  }
  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error: unknown }).error)
        : `Hostinger returned HTTP ${response.status}.`;
    throw new Error(message);
  }
  return data as Record<string, unknown>;
}

async function provisionWebsite(website: Website) {
  if (!config) throw new Error("Hostinger credentials are not configured.");
  const setup = await hostingerFetch(
    `/api/agency-hosting/v1/orders/${encodeURIComponent(config.orderId)}/websites/setups`,
    {
      method: "POST",
      body: JSON.stringify({
        datacenter_code: config.datacenterCode,
        flavor: "php-fpm",
        type: "node-static",
        settings: { php: { version: config.phpVersion } },
        domain: null,
      }),
    },
  );
  const setupUuid = String(setup.setup_uuid ?? "");
  if (!setupUuid) throw new Error("Hostinger did not return a setup UUID.");
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const status = await hostingerFetch(
      `/api/agency-hosting/v1/orders/${encodeURIComponent(config.orderId)}/websites/setups/${encodeURIComponent(setupUuid)}`,
    );
    if (status.status === "completed" && status.website_uid) return String(status.website_uid);
  }
  throw new Error(`Hostinger is still provisioning ${website.name}. Try publishing again shortly.`);
}

async function uploadAndImport(uid: string, archive: Buffer) {
  const upload = await hostingerFetch(`/api/agency-hosting/v1/websites/${encodeURIComponent(uid)}/files/upload-urls`, {
    method: "POST",
  });
  const uploadUrl = String(upload.url ?? "");
  const authKey = String(upload.auth_key ?? "");
  const restAuthKey = String(upload.rest_auth_key ?? "");
  if (!uploadUrl || !authKey || !restAuthKey) throw new Error("Hostinger did not return upload credentials.");
  const fileUrl = `${uploadUrl.replace(/\/$/, "")}/website.tar.gz?override=true`;
  const tusHeaders = {
    "X-Auth": authKey,
    "X-Auth-Rest": restAuthKey,
    "Tus-Resumable": "1.0.0",
  };
  const created = await fetch(fileUrl, {
    method: "POST",
    headers: { ...tusHeaders, "Upload-Length": String(archive.length), "Upload-Offset": "0" },
  });
  if (!created.ok) throw new Error(`Hostinger upload initialization failed with HTTP ${created.status}.`);
  const uploaded = await fetch(fileUrl, {
    method: "PATCH",
    headers: { ...tusHeaders, "Content-Type": "application/offset+octet-stream", "Upload-Offset": "0" },
    body: new Uint8Array(archive),
  });
  if (!uploaded.ok) throw new Error(`Hostinger archive upload failed with HTTP ${uploaded.status}.`);
  await hostingerFetch(`/api/agency-hosting/v1/websites/${encodeURIComponent(uid)}/files/import-archive`, {
    method: "POST",
    body: JSON.stringify({ archive_name: "website.tar.gz" }),
  });
}

export async function deployWithHostinger(website: Website): Promise<Deployment> {
  const createdAt = new Date().toISOString();
  const uid = website.hostingerUid ?? (await provisionWebsite(website));
  const archive = buildStaticArchive(website.draft, website.templateId);
  await uploadAndImport(uid, archive);
  const url = website.domain
    ? `https://${website.domain}`
    : `https://${website.id}.hostingersite.com`;
  return {
    id: `dep-${website.id}-${Date.now().toString(36)}`,
    websiteId: website.id,
    websiteName: website.name,
    status: "live",
    mode: "hostinger",
    createdAt,
    completedAt: new Date().toISOString(),
    url,
    message: "Static archive uploaded and imported through Hostinger Agency Hosting.",
  };
}

export async function connectDomainWithHostinger(website: Website, domain: string): Promise<DomainConnection> {
  const id = `domain-${website.id}`;
  if (!config || !website.hostingerUid) {
    return {
      id,
      websiteId: website.id,
      websiteName: website.name,
      domain,
      status: "instructions",
      provider: "external",
      verifiedAt: null,
      instructions: [
        `Add an A record for ${domain} pointing to the Hostinger website IP shown in hPanel.`,
        `Add an A record for www.${domain} pointing to the same Hostinger website IP, or use the Hostinger nameservers.`,
        "DNS changes can take up to 24–48 hours to propagate. Return here to verify the connection.",
      ],
    };
  }
  try {
    await hostingerFetch(`/api/agency-hosting/v1/websites/${encodeURIComponent(website.hostingerUid)}/domains`, {
      method: "POST",
      body: JSON.stringify({ domain }),
    });
    return {
      id,
      websiteId: website.id,
      websiteName: website.name,
      domain,
      status: "connected",
      provider: "hostinger",
      verifiedAt: new Date().toISOString(),
      instructions: [],
    };
  } catch {
    return {
      id,
      websiteId: website.id,
      websiteName: website.name,
      domain,
      status: "instructions",
      provider: "external",
      verifiedAt: null,
      instructions: [
        `Hostinger could not link ${domain} automatically.`,
        `Point ${domain} and www.${domain} to the website IP in hPanel, then verify again.`,
      ],
    };
  }
}

export function isHostingerConfigured() {
  return Boolean(config);
}
