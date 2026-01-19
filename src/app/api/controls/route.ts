import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ControlModel from "@/lib/models/control";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectToDatabase();
        const controls = await ControlModel.find().sort({ createdAt: -1 });
        return NextResponse.json(controls);
    } catch (error) {
        console.error("Error fetching controls:", error);
        return NextResponse.json({ error: "Failed to fetch controls" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();

        // Remove image fields if they exist, just in case
        const { id, _id, selectedImage, imageFile, ...controlData } = data;

        const newControl = await ControlModel.create(controlData);
        return NextResponse.json(newControl, { status: 201 });
    } catch (error) {
        console.error("Error saving control:", error);
        return NextResponse.json({ error: "Failed to save control" }, { status: 500 });
    }
}
