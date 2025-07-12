"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Bell, User } from "lucide-react";

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

// Define the Question interface
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

  // Load questions from session storage and update tags
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(
        window.sessionStorage?.getItem("questions") || "null"
      );
      if (stored) {
        setQuestions(stored as Question[]);
      }
    }
  }, []);

  // Load tags from questions
  useEffect(() => {
    const allTags: string[] = questions.flatMap((q: Question) => q.tags);
    const uniqueTags: string[] = [...new Set(allTags)];
    setAvailableTags(uniqueTags);
  }, [questions]);

  // Sort questions
  const sortedQuestions = useMemo((): Question[] => {
    let copy: Question[] = [...questions];
    switch (sortBy) {
      case "newest":
        return copy.sort((a: Question, b: Question) => b.id - a.id);
      case "unanswered":
        return copy.filter((q: Question) => q.answers === 0);
      case "popular":
        return copy.sort((a: Question, b: Question) => b.answers - a.answers);
      default:
        return copy;
    }
  }, [questions, sortBy]);

  // Filter by tag and search
  const filteredQuestions = useMemo((): Question[] => {
    let filtered: Question[] = sortedQuestions;

    // Filter by tag
    if (selectedTag !== "__all__") {
      filtered = filtered.filter((q: Question) => q.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (q: Question) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [sortedQuestions, selectedTag, searchQuery]);

  // Filter tags based on search
  const filteredTags = useMemo((): string[] => {
    if (!tagSearchQuery) return availableTags;
    return availableTags.filter((tag: string) =>
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto flex-1 px-4 py-6">
        {/* Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/ask">
            <Button className="w-full sm:w-auto">Ask New Question</Button>
          </Link>

          <div className="flex flex-1 gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* Tag Filter Dropdown with Search */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={tagSearchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTagSearchQuery(e.target.value)
                      }
                      className="pl-8 mb-2"
                    />
                  </div>
                </div>
                <SelectItem value="__all__">All Tags</SelectItem>
                {filteredTags.map((tag: string) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="mb-8 space-y-4">
          {filteredQuestions.map((q: Question) => (
            <Card
              key={q.id}
              className="bg-white dark:bg-zinc-800 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex-1">
                    <Link href={`/questions/${q.id}`}>
                      <h3 className="mb-2 text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400">
                        {q.title}
                      </h3>
                    </Link>

                    <p className="mb-3 line-clamp-2 text-gray-700 dark:text-gray-300">
                      {q.description}
                    </p>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {q.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{q.user}</span>
                      <span>{q.timeAgo}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900 px-3 py-2">
                      <div className="text-lg font-semibold">{q.answers}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
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
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[1, 2, 3, 4, 5, 6, 7].map((p: number) => (
            <Button
              key={p}
              size="icon"
              variant={p === 1 ? "default" : "ghost"}
              className="h-8 w-8"
            >
              {p}
            </Button>
          ))}
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
