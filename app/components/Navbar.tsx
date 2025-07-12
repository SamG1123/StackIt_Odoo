"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./Mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const updateLoginStatus = () => {
    const loginStatus = localStorage.getItem("stackit_loggedIn") === "1";
    setIsLoggedIn(loginStatus);
  };

  updateLoginStatus(); // Run on initial render

  window.addEventListener("stackit-auth-change", updateLoginStatus);

  return () => {
    window.removeEventListener("stackit-auth-change", updateLoginStatus);
  };
}, []);


  const handleLogout = () => {
    localStorage.removeItem("stackit_loggedIn");
    window.dispatchEvent(new Event("stackit-auth-change")); // ✅ notify Navbar
    setIsAvatarOpen(false);
    router.push("/"); // optional: redirect
  };

  return (
    <header className="relative z-50 dark:bg-slate-900 backdrop-blur">
      <div className="container mx-auto px-4 py-4 overflow-visible">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            StackIt
          </Link>

          <div className="flex items-center gap-4 relative z-50">
            {/* Bell */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Avatar dropdown */}
            {isLoggedIn ? (
              <div className="relative z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                >
                  <Image
                    src="/avatar.png"
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Button>

                {isAvatarOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded shadow-lg z-[9999] border border-slate-200 dark:border-slate-700">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => {
                            setIsAvatarOpen(false);
                            router.push("/profile");
                          }}
                        >
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
