"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  answers: number;
  timeAgo: string;
  answeredByUser?: boolean;
  answerContent?: string;
  createdAt?: string;
}

interface LoggedInUser {
  id: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  joinedDate?: string;
  reputation?: number;
  questionsAsked?: number;
  answersGiven?: number;
  helpfulVotes?: number;
  questions?: Question[];
}

// Custom SVG Icons (keeping the same icons as before)
const QuestionIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ChatIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function ProfilePage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "activity">("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const loggedIn = localStorage.getItem("stackit_loggedIn");
        const userData = localStorage.getItem("stackit_user");

        if (loggedIn === "1" && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsLoggedIn(true);

            // Fetch answered questions from API
            if (parsedUser.id) {
              try {
                const response = await fetch(
                  `/api/user/answers?userId=${parsedUser.id}`
                );
                if (response.ok) {
                  const data = await response.json();
                  setAnsweredQuestions(data.answeredQuestions || []);
                }
              } catch (error) {
                console.error("Error fetching answered questions:", error);
              }
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
            handleLogout();
          }
        } else {
          router.push("/login");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("stackit_loggedIn");
      localStorage.removeItem("stackit_user");
    }
    router.push("/login");
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null; // Will redirect to login
  }

  const askedQuestions = user.questions || [];

  return (
    <div className="min-h-screen dark:bg-slate-900 dark:text-white px-4">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Enhanced Profile Header */}
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-purple-200 dark:border-slate-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {/* Profile Picture */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 opacity-75 animate-pulse"></div>
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center hover:bg-purple-700 transition-colors overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-3 border-white dark:border-slate-700 shadow-lg flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
                    {user.bio || "Enthusiastic learner and knowledge sharer"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <LocationIcon className="h-4 w-4" />
                      <span>{user.location || "Location not specified"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {user.joinedDate || "Recently"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleEditProfile}
                    className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:bg-slate-800/90 dark:border-slate-700 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-all rounded-full"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLogout}
                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-all rounded-full"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-purple-200 dark:border-slate-700">
            <div className="text-center group">
              <div className="mb-2 mx-auto w-fit">
                <QuestionIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.questionsAsked || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Questions Asked
              </p>
            </div>
            <div className="text-center group">
              <div className="mb-2 mx-auto w-fit">
                <CheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.answersGiven || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Answers Given
              </p>
            </div>
            <div className="text-center group">
              <div className="mb-2 mx-auto w-fit">
                <HeartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.helpfulVotes || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Helpful Votes
              </p>
            </div>
            <div className="text-center group">
              <div className="mb-2 mx-auto w-fit">
                <BoltIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.reputation || 0}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Reputation
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex pt-10 border-b-2 border-purple-200 dark:border-slate-700 mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "profile"
                  ? "text-purple-700 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Profile
              {activeTab === "profile" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "activity"
                  ? "text-purple-700 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Activity
              {activeTab === "activity" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
              )}
            </button>
          </div>

          {activeTab === "profile" ? (
            <>
              {/* Asked Questions Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full"></div>
                  Asked Questions
                </h2>
                {askedQuestions.length === 0 ? (
                  <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 text-center border border-purple-200 dark:border-slate-700/50">
                    <div className="h-16 w-16 bg-purple-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QuestionIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                      You haven't asked any questions yet
                    </p>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all rounded-full dark:bg-purple-700 dark:hover:bg-purple-800"
                    >
                      Ask Your First Question
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {askedQuestions.map((q) => (
                      <Card
                        key={q.id}
                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-purple-200 dark:border-slate-700/50 rounded-3xl"
                      >
                        <CardContent className="p-6">
                          <Link href={`/questions/${q.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-purple-600 dark:text-white dark:hover:text-purple-400 mb-3 transition-colors">
                              {q.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-base">
                            {q.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {q.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 border-purple-200 dark:border-slate-600 transition-colors px-3 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">
                              {q.answers} answers
                            </span>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  Answered Questions
                </h2>
                {answeredQuestions.length === 0 ? (
                  <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 text-center border border-purple-200 dark:border-slate-700/50">
                    <div className="h-16 w-16 bg-green-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      You haven't answered any questions yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {answeredQuestions.map((q) => (
                      <Card
                        key={q.id}
                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-purple-200 dark:border-slate-700/50 rounded-3xl"
                      >
                        <CardContent className="p-6">
                          <Link href={`/questions/${q.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600 dark:text-white dark:hover:text-green-400 mb-3 transition-colors">
                              {q.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-base">
                            {q.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">
                              Answered {q.timeAgo}
                            </span>
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
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 dark:border-slate-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Recent Activity
              </h2>
              <div className="space-y-6">
                {[...askedQuestions, ...answeredQuestions]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || b.timeAgo).getTime() -
                      new Date(a.createdAt || a.timeAgo).getTime()
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-purple-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
                            item.answeredByUser
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : "bg-gradient-to-r from-purple-500 to-purple-600"
                          }`}
                        >
                          {item.answeredByUser ? (
                            <CheckIcon className="h-6 w-6 text-white" />
                          ) : (
                            <ChatIcon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.answeredByUser
                              ? "Answered a question"
                              : "Asked a question"}
                          </p>
                          <Link href={`/questions/${item.id}`}>
                            <p className="text-purple-600 dark:text-purple-400 hover:underline mb-2 font-medium">
                              {item.title}
                            </p>
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {askedQuestions.length === 0 &&
                  answeredQuestions.length === 0 && (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 bg-purple-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClockIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No activity yet
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
