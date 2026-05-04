import { NextResponse } from "next/server";
import { initialSnapshot } from "@/lib/logistics-simulator";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = initialSnapshot();
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
