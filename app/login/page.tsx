/* app/(auth)/login/page.tsx */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LOGIN_ENDPOINT = "/api/login";

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange =
    (field: "username" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    /* client check */
    const parsed = LoginSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: parsed.error.issues[0].message,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      /* store token (adjust if using cookies/next‑auth) */
      if (data.token) localStorage.setItem("stackit_token", data.token);

      toast({ title: "Logged in!" });
      router.push("/");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white px-4">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" /> Log in to StackIt
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            {/* USERNAME */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
                value={form.username}
                onChange={handleChange("username")}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log In
            </Button>

            {/* FOOTER LINKS */}
            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
              <span>
                New here?{" "}
                <Link href="/signup" className="font-medium hover:underline">
                  Create account
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
