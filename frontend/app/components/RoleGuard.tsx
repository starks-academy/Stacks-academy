"use client";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/lib/api";
import { ReactNode } from "react";

interface RoleGuardProps {
  /** Roles allowed to see this content */
  allow: Array<UserProfile["role"]>;
  /** What to render when access is denied. Defaults to null (invisible). */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the authenticated user's role is in `allow`.
 *
 * @example
 * <RoleGuard allow={["admin"]}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export default function RoleGuard({ allow, fallback = null, children }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated || !user) return <>{fallback}</>;
  if (!allow.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
}
