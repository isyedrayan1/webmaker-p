import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET() {
  try {
    const websites = repository.listWebsites();
    return NextResponse.json(websites);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list websites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clientName, templateId } = body;

    if (!name || !clientName || !templateId) {
      return NextResponse.json(
        { error: "name, clientName, and templateId are required" },
        { status: 400 }
      );
    }

    const created = repository.createWebsite({ name, clientName, templateId });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create website" },
      { status: 500 }
    );
  }
}
