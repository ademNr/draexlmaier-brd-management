import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/data";
import DefectLogModel from "@/lib/models/defect-log";
import { connectToDatabase } from "@/lib/mongoose";
import { defectLogSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectToDatabase();
        const defects = await DefectLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
        return NextResponse.json({ data: defects });
    } catch (error) {
        console.error("GET /api/defects", error);
        return NextResponse.json({ error: "Impossible de charger les défauts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const parsed = defectLogSchema.parse({
            ...payload,
            section: Number(payload.section),
        });
        await connectToDatabase();
        const created = await DefectLogModel.create(parsed);
        const analytics = await getAnalyticsSummary(parsed.brdId);
        return NextResponse.json(
            { data: { id: created._id, analytics }, message: "Défaut enregistré" },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/defects", error);
        return NextResponse.json({ error: "Enregistrement impossible" }, { status: 400 });
    }
}

