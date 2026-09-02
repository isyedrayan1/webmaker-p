import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { connectDomainWithHostinger, isHostingerConfigured } from "@/lib/hostinger";
import { getUserDomains, saveUserDomain } from "@/lib/firebase-service";
import { getServerUser } from "@/lib/auth-server";
import type { DomainConnection } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";

    // 1. Fetch live cloud domains
    try {
      const cloudDomains = await getUserDomains(userId);
      if (cloudDomains && cloudDomains.length > 0) {
        return NextResponse.json(cloudDomains);
      }
    } catch (err) {
      console.warn("[API domains] Firebase fetch warning:", err);
    }

    // 2. Fallback to cached repository
    const domains = repository.listDomains(userId);
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
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";
    const body = await request.json();
    const { websiteId, domain } = body;

    if (!websiteId || !domain) {
      return NextResponse.json(
        { error: "websiteId and domain are required" },
        { status: 400 }
      );
    }

    const website = repository.getWebsite(websiteId, userId);
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    let connection: DomainConnection;

    if (process.env.DEPLOYMENT_MODE === "hostinger" && isHostingerConfigured()) {
      connection = await connectDomainWithHostinger(website, domain);
    } else {
      connection = {
        id: `domain-${website.id}`,
        userId,
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

    connection.userId = userId;
    repository.saveDomain(connection, userId);
    repository.setDomain(website.id, domain, userId);

    // Persist directly to user cloud tree in Firebase RTDB
    await saveUserDomain(userId, connection).catch((err) => {
      console.warn("[API domains] Firebase domain sync warning:", err);
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to connect domain" },
      { status: 500 }
    );
  }
}
