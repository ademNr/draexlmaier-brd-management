import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/data";

export const dynamic = "force-dynamic";

const allowedIntervals = new Set(["hour", "day", "week", "month"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brdId = searchParams.get("brdId") || undefined;
    const intervalParam = searchParams.get("interval") || "hour";
    const daysParam = Number(searchParams.get("days") || "30");
    const interval = allowedIntervals.has(intervalParam) ? (intervalParam as "hour" | "day" | "week" | "month") : "hour";
    const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 30;
    const data = await getAnalyticsSummary(brdId, interval, days);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/analytics/summary", error);
    return NextResponse.json({ error: "Impossible de charger les analytics" }, { status: 500 });
  }
}

