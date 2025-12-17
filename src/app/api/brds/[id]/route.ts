import { NextResponse } from "next/server";
import { getBrdDetail } from "@/lib/data";
import BrdModel from "@/lib/models/brd";
import { connectToDatabase } from "@/lib/mongoose";

export const dynamic = "force-dynamic";

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: ParamsPromise) {
  try {
    const { id } = await params;
    const detail = await getBrdDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "BRD introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: detail });
  } catch (error) {
    console.error("GET /api/brds/:id", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: ParamsPromise) {
  try {
    const payload = await request.json();
    const { id } = await params;
    await connectToDatabase();
    const updated = await BrdModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return NextResponse.json({ error: "BRD introuvable" }, { status: 404 });
    return NextResponse.json({ data: { id: updated._id, status: updated.status } });
  } catch (error) {
    console.error("PATCH /api/brds/:id", error);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: ParamsPromise) {
  try {
    const { id } = await params;
    await connectToDatabase();
    let deleted = await BrdModel.findByIdAndDelete(id);
    // fallback: allow deletion by bbNumber if id is not an ObjectId
    if (!deleted) {
      deleted = await BrdModel.findOneAndDelete({ bbNumber: id });
    }
    // Even if already absent, respond 200 to keep UI consistent
    return NextResponse.json({ message: "BRD supprimé", found: Boolean(deleted) });
  } catch (error) {
    console.error("DELETE /api/brds/:id", error);
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
}

