"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  timeAgo: string;
}

const initialQuestions: Question[] = [
  {
    id: 1,
    title:
      "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 5,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "What is normalization in databases?",
    description:
      "Need help understanding normalization and its importance in database design.",
    tags: ["SQL", "Database"],
    user: "User Name",
    answers: 0,
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "What is a foreign key?",
    description: "How does a foreign key work in SQL? What are the benefits?",
    tags: ["SQL", "Keys"],
    user: "User Name",
    answers: 2,
    timeAgo: "6 hours ago",
  },
];

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("__all__");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");

  useEffect(() => {
    const allTags: string[] = questions.flatMap((q: Question) => q.tags);
    const uniqueTags: string[] = [...new Set(allTags)];
    setAvailableTags(uniqueTags);
  }, [questions]);

  const sortedQuestions = useMemo((): Question[] => {
    let copy: Question[] = [...questions];
    switch (sortBy) {
      case "newest":
        return copy.sort((a, b) => b.id - a.id);
      case "unanswered":
        return copy.filter((q) => q.answers === 0);
      case "popular":
        return copy.sort((a, b) => b.answers - a.answers);
      default:
        return copy;
    }
  }, [questions, sortBy]);

  const filteredQuestions = useMemo(() => {
    let filtered = sortedQuestions;

    if (selectedTag !== "__all__") {
      filtered = filtered.filter((q) => q.tags.includes(selectedTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [sortedQuestions, selectedTag, searchQuery]);

  const filteredTags = useMemo(() => {
    if (!tagSearchQuery) return availableTags;
    return availableTags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 dark:bg-zinc-900">
      <div className="container mx-auto flex-1 px-6 py-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row">
          <Link href="/ask">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-full shadow-lg px-8 py-3 font-medium dark:bg-blue-600 dark:hover:bg-blue-700 dark:rounded-md dark:shadow-none dark:px-6 dark:py-2">
              Ask New Question
            </Button>
          </Link>

          <div className="flex flex-1 gap-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 bg-white/70 backdrop-blur-sm border-2 border-purple-200 rounded-full px-4 py-2 shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:rounded-md">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-44 bg-white/70 backdrop-blur-sm border-2 border-purple-200 rounded-full px-4 py-2 shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:rounded-md">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-500 dark:text-gray-400" />
                    <Input
                      placeholder="Search tags..."
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      className="pl-10 mb-3 bg-white/70 border-2 border-purple-200 rounded-full py-2 dark:bg-zinc-700 dark:border-zinc-600 dark:rounded-md"
                    />
                  </div>
                </div>
                <SelectItem value="__all__">All Tags</SelectItem>
                {filteredTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-500 dark:text-gray-400 z-10" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border-2 border-purple-200 rounded-full shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:rounded-md"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="mb-10 space-y-6">
          {filteredQuestions.map((q) => (
            <Card
              key={q.id}
              className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:bg-white/90 rounded-3xl shadow-lg dark:bg-zinc-800 dark:border-zinc-700 dark:hover:shadow-md dark:rounded-lg dark:border dark:hover:border-zinc-600"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6 justify-between">
                  <div className="flex-1">
                    <Link href={`/questions/${q.id}`}>
                      <h3 className="mb-2 text-lg font-semibold hover:text-purple-600 text-gray-800 dark:text-white dark:hover:text-blue-400">
                        {q.title}
                      </h3>
                    </Link>

                    <p className="mb-3 line-clamp-2 text-gray-600 dark:text-gray-300">
                      {q.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-3">
                      {q.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-2 border-purple-300 rounded-full px-4 py-2 font-medium dark:bg-zinc-700 dark:text-gray-300 dark:border-zinc-600 dark:rounded-md"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{q.user}</span>
                      <span>{q.timeAgo}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-4 shadow-xl border-2 border-purple-400 dark:from-blue-900 dark:to-blue-900 dark:border-blue-800 dark:rounded-lg dark:shadow-lg">
                      <div className="text-xl font-bold">{q.answers}</div>
                      <div className="text-sm opacity-90 font-medium dark:text-gray-300">
                        answers
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            size="icon"
            className="rounded-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-2 border-purple-500 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:from-blue-700 dark:to-blue-800 dark:border-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-900 dark:focus:ring-blue-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {[1, 2, 3, 4, 5].map((p) => (
            <Button
              key={p}
              size="icon"
              className={`h-10 w-10 rounded-full border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-blue-500 ${
                p === 1
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md border-purple-500 hover:shadow-lg dark:from-blue-700 dark:to-blue-800 dark:border-blue-600"
                  : "bg-white/70 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-zinc-700 dark:text-gray-200 dark:border-zinc-600 dark:hover:bg-zinc-800"
              }`}
            >
              {p}
            </Button>
          ))}

          <Button
            size="icon"
            className="rounded-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-2 border-purple-500 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:from-blue-700 dark:to-blue-800 dark:border-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-900 dark:focus:ring-blue-500"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
