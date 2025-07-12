/* app/ask/page.tsx */
"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Bell, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function AskQuestionPage() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    if (tags.length === 0) {
      alert("Please add at least one tag");
      return;
    }

    interface Question {
      id: number;
      title: string;
      description: string;
      tags: string[];
      user: string;
      answers: number;
      timeAgo: string;
    }

    const newQuestion: Question = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      user: "Current User",
      answers: 0,
      timeAgo: "Just now",
    };

    // Get existing questions from sessionStorage
    const existingQuestions: Question[] = JSON.parse(
      (typeof window !== "undefined" &&
        window.sessionStorage?.getItem("questions")) ||
        "[]"
    );

    // Add new question to the beginning
    const updatedQuestions: Question[] = [newQuestion, ...existingQuestions];

    // Save to sessionStorage
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(
        "questions",
        JSON.stringify(updatedQuestions)
      );
    }

    // Update tags in sessionStorage
    const oldTags: string[] = JSON.parse(
      (typeof window !== "undefined" &&
        window.sessionStorage?.getItem("allTags")) ||
        "[]"
    );
    const updatedTags: string[] = [...new Set([...oldTags, ...tags])];
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem("allTags", JSON.stringify(updatedTags));
    }

    alert("Question submitted successfully!");

    // Reset form
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");

    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white">
      {/* ── main content ─────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-4xl bg-white dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">Ask a Question</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your question"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                className="text-base"
              />
            </div>

            {/* description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Description</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide detailed information about your question..."
              />
            </div>

            {/* tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium">
                Tags
              </Label>
              <div className="space-y-3">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTagInput(e.target.value)
                  }
                  onKeyDown={handleTagKeyPress}
                  onBlur={() => addTag(tagInput)}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* submit */}
            <div className="flex justify-end pt-4">
              <Button size="lg" className="px-8" onClick={handleSubmit}>
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
