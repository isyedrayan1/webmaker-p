import { repository } from "@/lib/repository";
import { compileLandingPageToHtml } from "@/lib/static-compiler";
import { DEFAULT_CLINIC_DATA } from "@/lib/builder-types";
import { getWebsiteFromFirebase } from "@/lib/firebase-service";
import type { LandingPageData } from "@/lib/builder-types";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await (context.params instanceof Promise
      ? context.params
      : Promise.resolve(context.params));
    
    const rawId = resolvedParams?.id || "preview-site";
    const id = decodeURIComponent(rawId).trim();

    let website = repository.getWebsite(id);

    // If website landingPageData is default or missing in memory, check Firebase
    if (!website || !website.landingPageData) {
      try {
        const fbSite = await getWebsiteFromFirebase(id);
        if (fbSite && fbSite.landingPageData) {
          website = fbSite;
        }
      } catch (err) {
        console.warn("Firebase preview fetch warning:", err);
      }
    }

    let pageData: LandingPageData;
    if (website && website.landingPageData) {
      pageData = website.landingPageData;
    } else {
      pageData = structuredClone(DEFAULT_CLINIC_DATA);
      pageData.id = id;
      pageData.name = website?.name || id.replace(/-[a-f0-9]{4,8}$/i, "").replace(/-/g, " ") || "Care Clinic";
      pageData.clientName = website?.clientName || `${pageData.name} Client`;
    }

    const html = compileLandingPageToHtml(pageData);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Preview render error:", error);
    // Absolute fallback: render default template rather than showing error
    const fallbackHtml = compileLandingPageToHtml(DEFAULT_CLINIC_DATA);
    return new Response(fallbackHtml, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
