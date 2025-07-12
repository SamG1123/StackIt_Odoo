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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="min-h-screen bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white">
      {/* ── header ───────────────────────────────────────── */}
      <header className="border-b bg-[#fffaf0]/95 backdrop-blur dark:bg-zinc-900/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold">
            StackIt
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

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
                onChange={(e) => setTitle(e.target.value)}
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
                  onChange={(e) => setTagInput(e.target.value)}
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
              <Button size="lg" className="px-8">
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
