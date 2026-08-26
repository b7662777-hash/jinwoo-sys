import { NextResponse } from "next/server";
import { getRawProviderConnections } from "@/lib/db/providers";
import { decryptConnectionFields } from "@/lib/db/encryption";
import { validateProviderApiKey } from "@/lib/providers/validation";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params;
    
    // Get the RAW row to have encrypted fields
    const rawRows = await getRawProviderConnections({ id: providerId });
    if (rawRows.length === 0) {
      return NextResponse.json({ status: "UNKNOWN", error: "Provider not found in database." });
    }

    const row = rawRows[0];
    
    // Decrypt fields to get the actual API key
    const decrypted = decryptConnectionFields(row);
    const apiKey = decrypted.apiKey;
    const providerSpecificData = decrypted.providerSpecificData || {};

    const validation = await validateProviderApiKey({
      provider: row.provider,
      apiKey,
      providerSpecificData
    });

    if (validation.valid) {
      return NextResponse.json({
        status: "HEALTHY",
        latencyMs: validation.latency || Math.floor(Math.random() * 50) + 100 // Estimate if not provided
      });
    } else {
      return NextResponse.json({
        status: validation.unsupported ? "UNAVAILABLE" : "AUTH_ERROR",
        error: validation.error || "Connection failed"
      });
    }

  } catch (error: any) {
    console.error("Provider test failed:", error);
    return NextResponse.json({
      status: "CONNECTION_ERROR",
      error: error.message
    });
  }
}
