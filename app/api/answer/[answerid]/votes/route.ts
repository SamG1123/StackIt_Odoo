import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Questions from "@/models/Questions";

export async function POST(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const { questionId, dir, commentId } = await req.json();
  await connectDB();

  const q = await Questions.findById(questionId);
  if (!q) return NextResponse.json({ ok: false, error: "Question not found" }, { status: 404 });

  const ans = q.answers.id(params.answerId);
  if (!ans) return NextResponse.json({ ok: false, error: "Answer not found" }, { status: 404 });

  const delta = dir === "up" ? 1 : -1;

  if (commentId) {
    const c = ans.comments.id(commentId);
    if (!c) return NextResponse.json({ ok: false, error: "Comment not found" }, { status: 404 });
    c.votes += delta;
  } else {
    ans.votes += delta;
  }

  await q.save();
  return NextResponse.json({ ok: true }, { status: 204 });
}
