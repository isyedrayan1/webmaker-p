import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { connectDomainWithHostinger, isHostingerConfigured } from "@/lib/hostinger";
import type { DomainConnection } from "@/lib/types";

export async function GET() {
  try {
    const domains = repository.listDomains();
    return NextResponse.json(domains);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list domains" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { websiteId, domain } = body;

    if (!websiteId || !domain) {
      return NextResponse.json(
        { error: "websiteId and domain are required" },
        { status: 400 }
      );
    }

    const website = repository.getWebsite(websiteId);
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    let connection: DomainConnection;

    if (process.env.DEPLOYMENT_MODE === "hostinger" && isHostingerConfigured()) {
      connection = await connectDomainWithHostinger(website, domain);
    } else {
      connection = {
        id: `domain-${website.id}`,
        websiteId: website.id,
        websiteName: website.name,
        domain,
        status: "connected",
        provider: "external",
        instructions: [
          `Add an A Record: @ -> 76.76.21.21 (or your Vercel/Netlify Apex IP)`,
          `Add a CNAME Record: www -> cname.webmaker.app`,
          `DNS changes take 15–30 mins to propagate globally.`,
        ],
        verifiedAt: new Date().toISOString(),
      };
    }

    repository.saveDomain(connection);
    repository.setDomain(website.id, domain);

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to connect domain" },
      { status: 500 }
    );
  }
}
