"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

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
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
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

    const newQuestion = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      tags,
      user: "Current User",
      answers: 0,
      timeAgo: "Just now",
    };

    const existing = JSON.parse(sessionStorage.getItem("questions") || "[]");
    const updated = [newQuestion, ...existing];
    sessionStorage.setItem("questions", JSON.stringify(updated));

    const oldTags = JSON.parse(sessionStorage.getItem("allTags") || "[]");
    const newTags = [...new Set([...oldTags, ...tags])];
    sessionStorage.setItem("allTags", JSON.stringify(newTags));

    alert("Question submitted successfully!");
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 dark:bg-zinc-900 dark:text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl bg-white/90 border-2 border-purple-200 shadow-lg rounded-3xl backdrop-blur-md dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-md dark:rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold dark:text-white">
              Ask a Question
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/70 border-2 border-purple-200 rounded-full py-2 px-4 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:rounded-md"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide detailed information..."
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-3">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter or comma)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  onBlur={() => addTag(tagInput)}
                  className="bg-white/70 border-2 border-purple-200 rounded-full py-2 px-4 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:rounded-md"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-2 border-purple-300 rounded-full px-4 py-2 font-medium dark:bg-zinc-700 dark:text-gray-300 dark:border-zinc-600 dark:rounded-md"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
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

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full px-6 py-2 shadow-md dark:bg-blue-700 dark:hover:bg-blue-800 dark:rounded-md"
              >
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
