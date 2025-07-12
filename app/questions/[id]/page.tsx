"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Check, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/rich-text-editor";
import { isLoggedIn } from "@/lib/auth";

/* ── mock data ─────────────────────────────────────────── */
const question = {
  id: 1,
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description:
    "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine both columns to make a separate column containing full name.",
  tags: ["SQL", "Tags"],
  user: "User Name",
  timeAgo: "2 hours ago",
};

const initialAnswers = [
  {
    id: 1,
    content: "The || Operator.\nThe + Operator.\nThe CONCAT Function.",
    user: "Answer User 1",
    votes: 3,
    isAccepted: false,
    timeAgo: "1 hour ago",
  },
  {
    id: 2,
    content: "Details",
    user: "Answer User 2",
    votes: 1,
    isAccepted: false,
    timeAgo: "30 minutes ago",
  },
];
/* ──────────────────────────────────────────────────────── */

export default function QuestionDetailPage() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleVote = (id: number, dir: "up" | "down") => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, votes: a.votes + (dir === "up" ? 1 : -1) } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto px-4 py-6">
        {/* breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:underline">
            Questions
          </Link>
          <span className="mx-2">{">"}</span>
          <span>{question.title.slice(0, 15)}…</span>
        </div>

        {/* question */}
        <Card className="mb-8 bg-white dark:bg-zinc-800">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold">{question.title}</h1>

            <div className="mb-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {question.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{question.user}</span>
              <span>{question.timeAgo}</span>
            </div>
          </CardContent>
        </Card>

        {/* Answers section */}
        <h2 className="mb-4 text-xl font-semibold">
          Answers ({answers.length})
        </h2>

        {loggedIn ? (
          <div className="mb-8 space-y-6">
            {answers.map((a) => (
              <Card key={a.id} className="bg-white dark:bg-zinc-800">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* vote column */}
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleVote(a.id, "up")}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{a.votes}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleVote(a.id, "down")}
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

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{a.user}</span>
                        <span>{a.timeAgo}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0"
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mb-12 rounded-xl bg-purple-100 p-8 text-center dark:bg-zinc-800">
            <p className="mb-4 text-lg">
              Please{" "}
              <Link
                href={`/login?next=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname : "/"
                )}`}
                className="font-semibold text-purple-700 underline dark:text-blue-400"
              >
                log in
              </Link>{" "}
              to view answers.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.pathname : "/"
              )}`}
            >
              <Button>Log in</Button>
            </Link>
          </div>
        )}

        {/* Submit Answer */}
        {loggedIn && (
          <Card className="bg-white dark:bg-zinc-800">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Submit Your Answer</h3>

              <div className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here..."
                />
                <div className="flex justify-end">
                  <Button size="lg" className="px-8">
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
