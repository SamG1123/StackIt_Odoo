// components/NotificationDropdown.tsx
"use client";

import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  anchorRef: React.RefObject<HTMLButtonElement>;
  onMarkAllAsRead: () => void; // ⬅️ new prop
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  anchorRef,
  onMarkAllAsRead,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen || typeof window === "undefined") return null;

  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const top = (anchorRect?.bottom ?? 0) + 8;
  const right = window.innerWidth - (anchorRect?.right ?? 0);

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={{ position: "absolute", top, right, zIndex: 9999 }}
      className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-sm text-gray-500 px-4 py-2">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={clsx(
                "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                !n.read && "font-semibold bg-yellow-50 dark:bg-yellow-900/20"
              )}
            >
              {n.message}
            </div>
          ))
        )}
      </div>

      {/* ✅ Mark all as read */}
      {notifications.some((n) => !n.read) && (
        <button
          onClick={onMarkAllAsRead}
          className="w-full text-sm text-center py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          Mark all as read
        </button>
      )}
    </div>,
    document.body
  );
}
