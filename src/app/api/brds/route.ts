import { NextResponse } from "next/server";
import { getBrdCards } from "@/lib/data";
import BrdModel from "@/lib/models/brd";
import { connectToDatabase } from "@/lib/mongoose";
import { brdSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getBrdCards();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/brds", error);
    return NextResponse.json({ error: "Impossible de charger les BRD" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = brdSchema.parse(payload);
    await connectToDatabase();
    const created = await BrdModel.create(parsed);
    return NextResponse.json({ data: { id: created._id, bbNumber: created.bbNumber } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/brds", error);
    return NextResponse.json({ error: "Création impossible" }, { status: 400 });
  }
}

