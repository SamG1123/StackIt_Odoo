"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  timeAgo: string;
  answeredByUser?: boolean;
}

export default function ProfilePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "activity">("profile");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("questions");
      if (data) {
        const parsed: Question[] = JSON.parse(data);
        setQuestions(parsed);
      }
    }
  }, []);

  const askedQuestions = questions.filter((q) => q.user === "Current User");
  const answeredQuestions = questions.filter((q) => q.answeredByUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 dark:bg-zinc-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white/80 dark:bg-zinc-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 dark:from-blue-700 dark:to-blue-900 border-4 border-white dark:border-zinc-700 shadow-md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Current User
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Enthusiastic learner and knowledge sharer
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-700 dark:border-blue-500 dark:text-blue-400 hover:bg-purple-100 dark:hover:bg-blue-900/30"
            >
              Ask Question
            </Button>
          </div>

          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {askedQuestions.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Questions
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {answeredQuestions.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Answers
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-300 dark:border-zinc-700 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === "profile"
                ? "text-purple-700 dark:text-blue-400 border-b-2 border-purple-700 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 font-medium transition-colors duration-200 ${
              activeTab === "activity"
                ? "text-purple-700 dark:text-blue-400 border-b-2 border-purple-700 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Activity
          </button>
        </div>

        {activeTab === "profile" ? (
          <>
            {/* Asked Questions Section */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Asked Questions
              </h2>
              {askedQuestions.length === 0 ? (
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't asked any questions yet
                  </p>
                  <Button className="mt-3">Ask Your First Question</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {askedQuestions.map((q) => (
                    <Card
                      key={q.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <Link href={`/questions/${q.id}`}>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 mb-2">
                            {q.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {q.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {q.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>{q.answers} answers</span>
                          <span className="mx-2">•</span>
                          <span>{q.timeAgo}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Answered Questions Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Answered Questions
              </h2>
              {answeredQuestions.length === 0 ? (
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't answered any questions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answeredQuestions.map((q) => (
                    <Card
                      key={q.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <Link href={`/questions/${q.id}`}>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 mb-2">
                            {q.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {q.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Answered {q.timeAgo}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Activity Tab Content */
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[...askedQuestions, ...answeredQuestions]
                .sort(
                  (a, b) =>
                    new Date(b.timeAgo).getTime() -
                    new Date(a.timeAgo).getTime()
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-zinc-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        {item.answeredByUser ? (
                          <svg
                            className="h-5 w-5 text-blue-500 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-blue-500 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.answeredByUser
                            ? "Answered a question"
                            : "Asked a question"}
                        </p>
                        <Link href={`/questions/${item.id}`}>
                          <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
                            {item.title}
                          </p>
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.timeAgo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              {askedQuestions.length === 0 &&
                answeredQuestions.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No activity yet
                  </p>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
