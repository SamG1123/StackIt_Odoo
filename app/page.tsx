"use client";

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
import Navbar from "./components/Navbar";

const questions = [
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
    title: "Question…..",
    description: "Descriptions….",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 3,
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Question…..",
    description: "Descriptions….",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 2,
    timeAgo: "6 hours ago",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto flex-1 px-4 py-6 ">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/ask">
            <Button className="w-full sm:w-auto">Ask New Question</Button>
          </Link>

          <div className="flex flex-1 gap-4">
            <Select defaultValue="newest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="more">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="more">More</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="votes">Votes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input placeholder="Search…" className="pl-10" />
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {questions.map((q) => (
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
                      {q.tags.map((tag) => (
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

        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
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
