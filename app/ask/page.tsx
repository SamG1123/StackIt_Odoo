"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/components/ui/use-toast";
import { isLoggedIn } from "@/lib/auth";

export default function AskQuestionPage() {
  const router = useRouter();
  const { toast } = useToast();

  /* ── auth guard ───────────────────────────────────── */
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?next=/ask");
    }
  }, [router]);
  /* --------------------------------------------------- */

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addTag = (t: string) => {
    const tag = t.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput("");
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  async function handleSubmit() {
    if (!title || !description || tags.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill title, description and add at least one tag",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags,
          user: "Current User",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit");
      }

      toast({ title: "Question submitted!" });
      router.push("/");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#e6e6fa] dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl bg-white border-2 border-purple-300 rounded-xl dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-600 dark:text-white">
              Ask a Question
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-slate-800 dark:text-slate-200">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-purple-700 dark:text-white font-medium"
              >
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-purple-700 dark:text-white font-medium">
                Description
              </Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide detailed information..."
                // className="border-purple-200 dark:border-slate-600
                //   [&_.ql-editor]:dark:bg-slate-700 [&_.ql-editor]:dark:text-slate-200
                //   [&_.ql-editor::placeholder]:dark:text-slate-400"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-purple-700 dark:text-white font-medium"
              >
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="Add tags (press Enter or comma)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyPress}
                onBlur={() => addTag(tagInput)}
                className="focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 hover:bg-purple-300/30 dark:hover:bg-purple-800"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                      >
                        <X className="h-3 w-3 text-purple-700 dark:text-purple-300" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all
                  dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                {loading ? "Submitting…" : "Submit Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
