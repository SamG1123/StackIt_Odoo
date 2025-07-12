/* app/(auth)/signup/page.tsx */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/* endpoint of your app router handler */
const SIGNUP_ENDPOINT = "/api/signup";

/* mirror your route‑level requirements */
const SignupSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", username: "", password: "" });

  const handleChange =
    (field: "email" | "username" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    /* client‑side validation */
    const parsed = SignupSchema.safeParse(form);
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
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast({ title: "Account created! You can log in now." });
      router.push("/login");
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
    <div className="flex min-h-screen items-center justify-center bg-[#dbaf57] text-black dark:bg-zinc-900 dark:text-white px-4">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Pencil className="h-6 w-6" /> Sign up for StackIt
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter the email address"
                required
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter the username"
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
                  placeholder="Enter the password"
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
              Create Account
            </Button>

            {/* FOOTER */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
