"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./Mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNotifications([
      { id: 1, message: "Someone replied to your question", read: false },
      { id: 2, message: "Someone commented on your answer", read: false },
      { id: 3, message: "You were mentioned in a post", read: true },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <header className="border-b bg-[#dbaf57] dark:bg-black backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            StackIt
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <div className="relative">
              <Button
                ref={bellRef}
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <NotificationDropdown
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                notifications={notifications}
                anchorRef={bellRef}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            <ModeToggle />

            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
