import { NextResponse } from "next/server";
import { getProviderConnections } from "@/lib/db/providers";
import { AI_PROVIDERS } from "@/shared/constants/providers";
import { buildAliasMaps } from "@/app/api/v1/models/catalogProviderMaps";
import { buildUnifiedModelsResponseCore } from "@/app/api/v1/models/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const connections = await getProviderConnections();
  const maps = buildAliasMaps();
  const aiProvidersKeys = Object.keys(AI_PROVIDERS);
  
  const catalogResponse = await buildUnifiedModelsResponseCore(req);
  const status = catalogResponse.status;
  const text = await catalogResponse.text();

  return NextResponse.json({
    connections,
    status,
    text: text.substring(0, 1000)
  });
}
