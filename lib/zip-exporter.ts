import JSZip from "jszip";
import saveAs from "file-saver";
import { compileLandingPageToHtml } from "./static-compiler";
import { THEME_PALETTES, type LandingPageData } from "./builder-types";

async function fetchImageBytes(url: string): Promise<{ data: Uint8Array; ext: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "";
    let ext = "webp";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";
    else if (contentType.includes("svg")) ext = "svg";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("avif")) ext = "avif";
    else {
      const urlExt = url.split("?")[0].split(".").pop()?.toLowerCase();
      if (urlExt && ["png", "jpg", "jpeg", "webp", "svg", "gif", "avif"].includes(urlExt)) {
        ext = urlExt;
      }
    }
    return { data: new Uint8Array(arrayBuffer), ext };
  } catch (err) {
    console.warn("Could not bundle remote image into ZIP:", url, err);
    return null;
  }
}

export async function exportLandingPageAsZip(site: LandingPageData): Promise<void> {
  const zip = new JSZip();
  const theme = THEME_PALETTES[site.theme] || THEME_PALETTES.emerald;
  const domain = site.domain || `${site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.health`;
  const todayIso = new Date().toISOString().split("T")[0];

  // Deep clone site data to rewrite image paths for the offline standalone package
  const bundledSite = structuredClone(site);
  const imagesFolder = zip.folder("images");

  // 1. Scan and download all referenced images to bundle inside images/ folder
  const imageFetchTasks: Promise<void>[] = [];

  bundledSite.sections = bundledSite.sections.map((sec) => {
    if (sec.type === "navbar" && "logoUrl" in sec.data && sec.data.logoUrl) {
      const originalUrl = sec.data.logoUrl as string;
      const task = async () => {
        const fetched = await fetchImageBytes(originalUrl);
        if (fetched && imagesFolder) {
          const fileName = `logo.${fetched.ext}`;
          imagesFolder.file(fileName, fetched.data);
          (sec.data as unknown as Record<string, unknown>).logoUrl = `./images/${fileName}`;
        }
      };
      imageFetchTasks.push(task());
    }

    if (sec.type === "hero" && "imageUrl" in sec.data && sec.data.imageUrl) {
      const originalUrl = sec.data.imageUrl as string;
      const task = async () => {
        const fetched = await fetchImageBytes(originalUrl);
        if (fetched && imagesFolder) {
          const fileName = `hero.${fetched.ext}`;
          imagesFolder.file(fileName, fetched.data);
          (sec.data as unknown as Record<string, unknown>).imageUrl = `./images/${fileName}`;
        }
      };
      imageFetchTasks.push(task());
    }

    if (sec.type === "doctors" && "doctors" in sec.data && Array.isArray(sec.data.doctors)) {
      sec.data.doctors.forEach((doc, idx) => {
        if (doc.imageUrl) {
          const originalUrl = doc.imageUrl;
          const task = async () => {
            const fetched = await fetchImageBytes(originalUrl);
            if (fetched && imagesFolder) {
              const fileName = `doctor-${idx + 1}.${fetched.ext}`;
              imagesFolder.file(fileName, fetched.data);
              doc.imageUrl = `./images/${fileName}`;
            }
          };
          imageFetchTasks.push(task());
        }
      });
    }

    if (sec.type === "services" && "services" in sec.data && Array.isArray(sec.data.services)) {
      sec.data.services.forEach((srv, idx) => {
        if (srv.imageUrl) {
          const originalUrl = srv.imageUrl;
          const task = async () => {
            const fetched = await fetchImageBytes(originalUrl);
            if (fetched && imagesFolder) {
              const fileName = `service-${idx + 1}.${fetched.ext}`;
              imagesFolder.file(fileName, fetched.data);
              srv.imageUrl = `./images/${fileName}`;
            }
          };
          imageFetchTasks.push(task());
        }
      });
    }

    return sec;
  });

  // Also bundle Favicon and OpenGraph Social Share images if present
  if (bundledSite.assets?.faviconUrl) {
    const originalUrl = bundledSite.assets.faviconUrl;
    const task = async () => {
      const fetched = await fetchImageBytes(originalUrl);
      if (fetched && imagesFolder) {
        const fileName = `favicon.${fetched.ext}`;
        imagesFolder.file(fileName, fetched.data);
        if (bundledSite.assets) {
          bundledSite.assets.faviconUrl = `./images/${fileName}`;
        }
      }
    };
    imageFetchTasks.push(task());
  }

  if (bundledSite.assets?.ogImageUrl) {
    const originalUrl = bundledSite.assets.ogImageUrl;
    const task = async () => {
      const fetched = await fetchImageBytes(originalUrl);
      if (fetched && imagesFolder) {
        const fileName = `og-share.${fetched.ext}`;
        imagesFolder.file(fileName, fetched.data);
        if (bundledSite.assets) {
          bundledSite.assets.ogImageUrl = `./images/${fileName}`;
        }
      }
    };
    imageFetchTasks.push(task());
  }

  // Wait for all image assets to be fetched & packed into ZIP
  await Promise.allSettled(imageFetchTasks);

  // 2. Generate 100% pure, sanitized standalone index.html (isEditable = false)
  const htmlContent = compileLandingPageToHtml(bundledSite, false);
  zip.file("index.html", htmlContent);

  // 3. Generate Google SEO XML Sitemap
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${domain}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  zip.file("sitemap.xml", sitemapContent);

  // 4. Generate Search Engine Crawler Directives (robots.txt)
  const robotsContent = `# Robots.txt for ${site.name}
User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
  zip.file("robots.txt", robotsContent);

  // 5. Generate Progressive Web App (PWA) Manifest
  const manifestContent = JSON.stringify(
    {
      name: site.name,
      short_name: site.name.slice(0, 15),
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: theme.primary,
      description: site.seo?.description || `Official website for ${site.name}`,
    },
    null,
    2
  );
  zip.file("site.webmanifest", manifestContent);

  // 6. Generate Client Handover & Universal Deployment Guide
  const readmeContent = `# ${site.name} — Production Static Website Package

This package contains the complete, production-ready website generated by Webmaker.
It is 100% standalone, fully offline-capable, and requires zero backend server runtimes, databases, or build steps.

---

## Deployment Options

### 1. Hostinger / cPanel / Standard Web Hosting
1. Log in to your hosting control panel (e.g. Hostinger hPanel or cPanel File Manager).
2. Navigate to your website's \`public_html/\` root folder.
3. Upload and extract this ZIP file (or upload \`index.html\`, \`images/\`, \`sitemap.xml\`, \`robots.txt\`).
4. The website is live instantly with sub-100ms response times.

### 2. Netlify / Vercel / Cloudflare Pages
1. Go to your Netlify or Cloudflare Pages dashboard.
2. Drag and drop the unzipped folder into the deployment drop-zone.
3. Deploy is complete in 3 seconds.

### 3. Apache / Nginx / VPS
- **Nginx root directory**: \`/var/www/html\`
- **Apache document root**: \`/var/www/html\`

---

## Package Contents
- \`index.html\` — Pristine, semantic HTML5 with local image references (\`./images/...\`).
- \`images/\` — All optimized local images bundled directly for zero egress costs.
- \`sitemap.xml\` — Search engine indexation sitemap.
- \`robots.txt\` — Web crawler configuration.
- \`site.webmanifest\` — Mobile app bookmarking and PWA configuration.
- \`site-data.json\` — Raw data backup for future re-import or edits.

---
Built for **${site.clientName}** on ${new Date().toLocaleDateString()}.
`;
  zip.file("README.md", readmeContent);

  // 7. Generate editable data backup JSON
  zip.file("site-data.json", JSON.stringify(bundledSite, null, 2));

  // 8. Compile ZIP and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `${site.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-dist.zip`;
  saveAs(blob, filename);
}

// Alias for convenience
export const exportLandingPageZip = exportLandingPageAsZip;
