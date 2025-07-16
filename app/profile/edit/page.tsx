"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Edit, MapPin, Mail, Calendar } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-purple-200 dark:border-slate-700/50">
          <CardHeader className="text-center pb-2">
            <div className="relative mx-auto mb-4">
              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden mx-auto">
                {user.profileImage ? (
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.username}
            </h1>

            <div className="flex items-center justify-center gap-4 text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}
            </div>

            <Link href="/profile/edit">
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-6">
            {user.bio && (
              <>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-4 w-4" />
                    About
                  </h3>
                  <p className="text-muted-foreground">{user.bio}</p>
                </div>
                <Separator className="my-6" />
              </>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Joined{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
              {user.updatedAt && user.updatedAt !== user.createdAt && (
                <>
                  <span>•</span>
                  <span>
                    Updated {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
