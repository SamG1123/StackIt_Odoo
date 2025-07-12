import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Questions from "@/models/Questions";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const q = await Questions.findById(params.id).lean();
  if (!q) {
    return NextResponse.json(
      { ok: false, error: "Questions not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, data: q });
}

export async function POST(req: NextRequest) {
  // create a brand‑new Questions (optional)
  const body = await req.json();
  await connectDB();
  const q = await Questions.create(body);
  return NextResponse.json({ ok: true, data: q }, { status: 201 });
}
