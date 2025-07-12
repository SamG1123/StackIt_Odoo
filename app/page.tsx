"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { isLoggedIn } from "@/lib/auth"; // ← NEW

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const { toast } = useToast();

  /* fetch questions ---------------------------------------------------- */
  const { data, error, isLoading } = useSWR<Question[]>(
    "/api/questions",
    fetcher
  );

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to load questions",
      });
    }
  }, [error]);

  /* ui state ----------------------------------------------------------- */
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("__all__");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  /* unique tags -------------------------------------------------------- */
  const availableTags = useMemo(
    () => (data ? [...new Set(data.flatMap((q) => q.tags))] : []),
    [data]
  );

  /* sorting ------------------------------------------------------------ */
  const sorted = useMemo(() => {
    if (!data) return [];
    const copy = [...data];
    switch (sortBy) {
      case "newest":
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "unanswered":
        return copy.filter((q) => q.answers === 0);
      case "popular":
        return copy.sort((a, b) => b.answers - a.answers);
      default:
        return copy;
    }
  }, [data, sortBy]);

  /* filter ------------------------------------------------------------- */
  const filteredQuestions = useMemo(() => {
    let out = sorted;
    if (selectedTag !== "__all__")
      out = out.filter((q) => q.tags.includes(selectedTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return out;
  }, [sorted, selectedTag, searchQuery]);

  /* tag search inside dropdown ---------------------------------------- */
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery) return availableTags;
    return availableTags.filter((t) =>
      t.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);

  /* ------------------------------------------------------------------- */
  const askHref = isLoggedIn() ? "/ask" : "/login?next=/ask";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 dark:bg-zinc-900">
      <div className="container mx-auto flex-1 px-6 py-8">
        {/* Action bar ---------------------------------------------------- */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row">
          <Link href={askHref}>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full px-8 py-3 dark:bg-blue-600 dark:hover:bg-blue-700">
              Ask New Question
            </Button>
          </Link>

          {/* sort + tag filter */}
          <div className="flex flex-1 gap-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 rounded-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-44 rounded-full">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4" />
                    <Input
                      placeholder="Search tags..."
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      className="pl-10 mb-3 rounded-full"
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

          {/* full‑text search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Question list ------------------------------------------------- */}
        <div className="mb-10 space-y-6">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-3xl" />
            ))}

          {filteredQuestions.map((q) => (
            <Card
              key={q._id}
              className="rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:shadow-xl transition"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6 justify-between">
                  <div className="flex-1">
                    <Link href={`/questions/${q._id}`}>
                      <h3 className="mb-2 text-lg font-semibold hover:text-purple-600 dark:hover:text-blue-400">
                        {q.title}
                      </h3>
                    </Link>

                    <p className="mb-3 line-clamp-2 text-gray-700 dark:text-gray-300">
                      {q.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-3">
                      {q.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="rounded-full px-4 py-1 bg-purple-100 border border-purple-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{q.user}</span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }).format(new Date(q.createdAt))}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="rounded-3xl bg-purple-600 text-white px-6 py-4">
                      <div className="text-xl font-bold">{q.answers}</div>
                      <div className="text-sm opacity-90">answers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isLoading && filteredQuestions.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No questions found.
            </p>
          )}
        </div>

        {/* (static) pagination placeholder ------------------------------ */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button size="icon" disabled>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button size="icon">1</Button>
          <Button size="icon" disabled>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
