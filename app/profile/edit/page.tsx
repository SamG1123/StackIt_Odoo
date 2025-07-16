"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LoggedInUser {
  id: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  profileImage?: string;
}

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function EditProfilePage() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with mock user data for demonstration
    const mockUser: LoggedInUser = {
      id: "1",
      username: "johndoe",
      email: "john@example.com",
      bio: "Software developer passionate about creating amazing user experiences.",
      location: "San Francisco, CA",
      profileImage: "",
    };

    setUser(mockUser);
    setFormData({
      username: mockUser.username,
      email: mockUser.email,
      bio: mockUser.bio || "",
      location: mockUser.location || "",
      profileImage: mockUser.profileImage || "",
    });
    setImagePreview(mockUser.profileImage || "");
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          profileImage: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...formData,
      };
      // In a real app, you would save this to your backend
      console.log("Updated user:", updatedUser);
      setIsLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        location: user.location || "",
        profileImage: user.profileImage || "",
      });
      setImagePreview(user.profileImage || "");
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 dark:text-white px-4">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-slate-700 dark:text-purple-400 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-purple-200 dark:border-slate-700/50">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 opacity-75 animate-pulse"></div>
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
              {/* Camera overlay for hover effect */}
              <div
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                onClick={handleImageClick}
              >
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleImageClick}
                className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:bg-slate-800/90 dark:border-slate-700 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-all rounded-full"
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                Change Profile Picture
              </Button>

              {imagePreview && (
                <Button
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-all rounded-full"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Click to upload a new profile picture
              <br />
              <span className="text-xs">Max file size: 5MB</span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-200 dark:border-slate-700/50">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <Label
                htmlFor="username"
                className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300"
              >
                <UserIcon className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="bg-white/90 dark:bg-slate-800/90 border-purple-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300"
              >
                <MailIcon className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/90 dark:bg-slate-800/90 border-purple-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
                required
              />
            </div>

            {/* Location Field */}
            <div>
              <Label
                htmlFor="location"
                className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300"
              >
                <LocationIcon className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="bg-white/90 dark:bg-slate-800/90 border-purple-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="Where are you based?"
              />
            </div>

            {/* Bio Field */}
            <div>
              <Label
                htmlFor="bio"
                className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300"
              >
                <InfoIcon className="h-4 w-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="bg-white/90 dark:bg-slate-800/90 border-purple-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 transition-all rounded-full dark:bg-purple-700 dark:hover:bg-purple-800"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
