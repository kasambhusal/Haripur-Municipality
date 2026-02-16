"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Nav from "@/ui/Nav";
import Footer from "@/ui/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Nav />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
