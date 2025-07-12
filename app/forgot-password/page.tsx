/* app/(auth)/forgot-password/page.tsx */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      /* TODO: call /api/auth/forgot-password */
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* -------- confirmation state ---------- */
  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#7ae9f8] px-4 dark:bg-slate-900">
        <Card className="w-full max-w-md text-center dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <ShieldCheck className="h-6 w-6 text-teal-600 dark:text-cyan-400" />
              Check your inbox!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Weʼve sent a secure link to{" "}
              <span className="font-medium">{email}</span>. Follow it to reset
              your password.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------- form state ------------------ */
  return (
    <div className="flex min-h-screen items-center justify-center  px-4 dark:bg-slate-900 dark:text-white">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6" /> Forgot your password?
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset link
            </Button>

            <p className="text-center text-sm">
              Remembered?{" "}
              <Link href="/login" className="font-medium hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
