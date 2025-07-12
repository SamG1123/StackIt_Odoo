import { NextRequest, NextResponse } from "next/server";

import Questions from "@/models/Questions";
import connectDB from "@/lib/mongodb";


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { content, user } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Content required" },
      { status: 400 }
    );
  }

  await connectDB();
  const q = await Questions.findById(params.id);
  if (!q) {
    return NextResponse.json(
      { ok: false, error: "Question not found" },
      { status: 404 }
    );
  }

  q.answers.push({ content, user });
  await q.save();

  // Return the freshly‑added answer so the client can show it optimistically
  const newAnswer = q.answers[q.answers.length - 1];
  return NextResponse.json({ ok: true, data: newAnswer }, { status: 201 });
}
