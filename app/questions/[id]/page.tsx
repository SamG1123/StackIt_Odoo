"use client";

import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronUp, ChevronDown, Check, CornerDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/rich-text-editor";
import { isLoggedIn } from "@/lib/auth";
import { useQuestion } from "@/hooks/useQuestion";

export default function QuestionDetailPage() {
  /* ── routing / data ───────────────────────── */
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname(); // ✅ SSR‑safe current path
  const router = useRouter();

  const {
    question,
    isLoading,
    voteAnswer,
    voteComment,
    addComment,
    addAnswer,
  } = useQuestion(id);

  /* ── local state ──────────────────────────── */
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [newAnswer, setNewAnswer] = useState("");
  const loggedIn = isLoggedIn();

  /* ── loading / 404 guards ─────────────────── */
  if (isLoading) return <p className="p-8">Loading…</p>;
  if (!question) return <p className="p-8">Question not found.</p>;

  const answers = question.answers ?? [];

  /* ── helpers ──────────────────────────────── */
  const canonicalDate = (d: string | number | Date) =>
    new Date(d).toISOString().replace("T", " ").replace("Z", " UTC");

  /* ── render ───────────────────────────────── */
  return (
    <div className="min-h-screen text-black dark:bg-slate-900 dark:text-white">
      <div className="container mx-auto px-4 py-6">
        {/* breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:underline">
            Questions
          </Link>
          <span className="mx-2">{">"}</span>
          <span>{question.title.slice(0, 20)}…</span>
        </div>

        {/* question */}
        <Card className="mb-8 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold">{question.title}</h1>

            <div className="mb-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {question.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{question.user}</span>
              <span>{canonicalDate(question.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <h2 className="mb-4 text-xl font-semibold">
          Answers ({answers.length})
        </h2>

        {loggedIn ? (
          <div className="mb-8 space-y-6">
            {answers.map((a) => (
              <Card
                key={a._id}
                className="bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* vote column */}
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => voteAnswer(a._id, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{a.votes}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => voteAnswer(a._id, "down")}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {a.isAccepted && (
                        <Check className="mt-2 h-5 w-5 text-green-600" />
                      )}
                    </div>

                    {/* answer body */}
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none mb-4 dark:prose-invert">
                        {a.content.split("\n").map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>

                      {/* answer meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <span>{a.user}</span>
                        <span>{canonicalDate(a.createdAt)}</span>
                      </div>

                      {/* COMMENT LIST */}
                      {(a.comments ?? []).length > 0 && (
                        <div className="mb-4 space-y-4">
                          {a.comments.map((c) => (
                            <div key={c._id} className="flex gap-3 text-sm">
                              <div className="flex flex-col items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    voteComment(a._id, c._id, "up")
                                  }
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <span>{c.votes}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    voteComment(a._id, c._id, "down")
                                  }
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex-1">
                                <p>{c.content}</p>
                                <div className="text-gray-500 dark:text-gray-400">
                                  {c.user} • {canonicalDate(c.createdAt)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ADD COMMENT */}
                      <div className="rounded-lg border border-teal-100 dark:border-slate-700 p-4">
                        <RichTextEditor
                          value={newComment[a._id] || ""}
                          onChange={(val) =>
                            setNewComment((nc) => ({
                              ...nc,
                              [a._id]: val,
                            }))
                          }
                          placeholder="Add a comment…"
                        />
                        <div className="flex justify-end pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!newComment[a._id]?.trim()}
                            onClick={async () => {
                              await addComment(a._id, newComment[a._id], "You");
                              setNewComment((nc) => ({
                                ...nc,
                                [a._id]: "",
                              }));
                            }}
                            className="flex items-center gap-2"
                          >
                            <CornerDownLeft className="h-4 w-4" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mb-12 rounded-xl bg-teal-100/60 p-8 text-center dark:bg-slate-800">
            <p className="mb-4 text-lg">
              Please{" "}
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="font-semibold text-teal-700 underline dark:text-cyan-400"
              >
                log in
              </Link>{" "}
              to view answers.
            </p>
            <Button
              className="bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
              onClick={() =>
                router.push(`/login?next=${encodeURIComponent(pathname)}`)
              }
            >
              Log in
            </Button>
          </div>
        )}

        {/* Submit Answer */}
        {loggedIn && (
          <Card className="bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Submit Your Answer</h3>

              <div className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here..."
                />
                <div className="flex justify-end">
                  <Button
                    size="lg"
                    disabled={!newAnswer.trim()}
                    className="px-8 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                    onClick={async () => {
                      await addAnswer(newAnswer, "You");
                      setNewAnswer("");
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
