/* components/Navbar.tsx */
"use client";

import Link from "next/link";
import { Search, Bell, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./Mode-toggle";

export default function Navbar() {
  return (
    <header className="border-b bg-[#dbaf57] dark:bg-black backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* logo */}
          <Link href="/" className="text-2xl font-bold">
            StackIt
          </Link>

          {/* actions */}
          <div className="flex items-center gap-4">
            {/* mobile search icon (hidden on ≥sm) */}
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* theme toggle */}
            <ModeToggle />

            {/* auth link */}
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
