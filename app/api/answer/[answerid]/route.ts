import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Questions from "@/models/Questions";

export async function POST(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const { content, user, questionId } = await req.json();
  await connectDB();

  const q = await Questions.findById(questionId);
  if (!q) return NextResponse.json({ ok: false, error: "Question not found" }, { status: 404 });

  const ans = q.answers.id(params.answerId);
  if (!ans) return NextResponse.json({ ok: false, error: "Answer not found" }, { status: 404 });

  ans.comments.push({ content, user });
  await q.save();
  return NextResponse.json({ ok: true, data: ans.comments[ans.comments.length - 1] }, { status: 201 });
}
