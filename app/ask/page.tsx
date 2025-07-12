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
import { isLoggedIn } from "@/lib/auth"; // ← NEW

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
    <div className="min-h-screen  dark:bg-zinc-900 dark:text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl bg-white/90 border-2 border-purple-200 shadow-lg rounded-3xl dark:bg-zinc-800 dark:border-zinc-700">
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
              <Input
                id="tags"
                placeholder="Add tags (press Enter or comma)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyPress}
                onBlur={() => addTag(tagInput)}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge key={tag}>
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                      >
                        <X className="h-3 w-3" />
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
                className="px-8"
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
