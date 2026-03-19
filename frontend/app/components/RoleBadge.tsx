"use client";

import { UserProfile } from "@/lib/api";

interface RoleBadgeProps {
  role: UserProfile["role"];
  size?: "sm" | "md";
}

export default function RoleBadge({ role, size = "sm" }: RoleBadgeProps) {
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const px = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1";

  return (
    <div className="flex items-center gap-1.5">
      {role === "admin" && (
        <span
          className={`${textSize} ${px} bg-purple-600/80 text-purple-100 font-bold rounded uppercase tracking-wide ring-1 ring-purple-500/40`}
        >
          Admin
        </span>
      )}
      {role === "user" && (
        <span
          className={`${textSize} ${px} bg-white/10 text-gray-300 font-medium rounded uppercase tracking-wide`}
        >
          Member
        </span>
      )}
    </div>
  );
}
