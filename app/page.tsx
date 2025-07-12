/* app/page.tsx */
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
import { isLoggedIn } from "@/lib/auth";

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  createdAt: string;
}

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function HomePage() {
  const { toast } = useToast();
  const { data, error, isLoading } = useSWR<Question[]>(
    "/api/questions",
    fetcher
  );

  useEffect(() => {
    if (error)
      toast({ variant: "destructive", title: "Failed to load questions" });
  }, [error]);

  /* ui state */
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("__all__");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  /* data helpers */
  const tags = useMemo(
    () => (data ? [...new Set(data.flatMap((q) => q.tags))] : []),
    [data]
  );

  const sorted = useMemo(() => {
    if (!data) return [];
    const list = [...data];
    switch (sortBy) {
      case "newest":
        return list.sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
      case "unanswered":
        return list.filter((q) => q.answers === 0);
      case "popular":
        return list.sort((a, b) => b.answers - a.answers);
      default:
        return list;
    }
  }, [data, sortBy]);

  const visible = useMemo(() => {
    let out = sorted;
    if (selectedTag !== "__all__")
      out = out.filter((q) => q.tags.includes(selectedTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.description.toLowerCase().includes(q) ||
          x.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return out;
  }, [sorted, selectedTag, searchQuery]);

  const tagOpts = !tagSearchQuery
    ? tags
    : tags.filter((t) =>
        t.toLowerCase().includes(tagSearchQuery.toLowerCase())
      );

  const askHref = isLoggedIn() ? "/ask" : "/login?next=/ask";

  /* UI --------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900">
      <div className="container mx-auto flex-1 px-6 py-8">
        {/* action bar */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row">
          <Link href={askHref}>
            <Button
              className="px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all
                    dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              Ask New Question
            </Button>
          </Link>

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
                {tagOpts.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* global search */}
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

        {/* list */}
        <div className="mb-10 space-y-6">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-3xl" />
            ))}

          {visible.map((q) => (
            <Card
              key={q._id}
              className="rounded-3xl bg-white/80 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition dark:bg-slate-800 dark:border-slate-700"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6 justify-between">
                  <div className="flex-1">
                    <Link href={`/questions/${q._id}`}>
                      <h3 className="mb-2 text-lg font-semibold hover:text-purple-700 dark:hover:text-cyan-400">
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
                          className="rounded-full px-4 py-1 bg-purple-50 border border-purple-200 text-purple-800 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
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
                    <div
                      className="rounded-2xl bg-purple-700 text-white px-6 py-4 
              dark:bg-gradient-to-r dark:from-purple-600 dark:to-purple-700
              transition-colors duration-300 "
                    >
                      {" "}
                      <div className="text-xl font-bold">{q.answers}</div>
                      <div className="text-m opacity-90">Answers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isLoading && visible.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No questions found.
            </p>
          )}
        </div>

        {/* (static) pagination */}
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
