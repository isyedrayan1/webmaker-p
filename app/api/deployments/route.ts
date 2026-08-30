import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET() {
  try {
    const deployments = repository.listDeployments();
    return NextResponse.json(deployments);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list deployments" },
      { status: 500 }
    );
  }
}
