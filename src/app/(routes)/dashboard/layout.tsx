"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/others/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
