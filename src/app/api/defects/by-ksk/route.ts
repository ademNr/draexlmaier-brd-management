import { NextResponse } from "next/server";
import DefectLogModel from "@/lib/models/defect-log";
import { connectToDatabase } from "@/lib/mongoose";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brdId = searchParams.get("brdId");
    const ksk = searchParams.get("ksk");
    if (!brdId || !ksk) {
      return NextResponse.json({ error: "brdId et ksk requis" }, { status: 400 });
    }
    await connectToDatabase();
    const result = await DefectLogModel.deleteMany({ brdId, kskNumber: ksk });
    return NextResponse.json({ deleted: result.deletedCount ?? 0 });
  } catch (error) {
    console.error("DELETE /api/defects/by-ksk", error);
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
}

