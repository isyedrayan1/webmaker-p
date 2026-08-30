import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET() {
  try {
    const templates = repository.listTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list templates" },
      { status: 500 }
    );
  }
}
