import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { LoginProvider } from "@/context/login-context";
import { ConditionalLayout } from "@/app/conditional-layout";
import { QueryProvider } from "./providers/query-provider";
import { NotificationProvider } from "./providers/notification-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "हरिपुर डिजिटल प्रोफाइल",
<<<<<<< HEAD
  description: "A website for badimalika municipality",
=======
  description: "A digital profile for Haripur municipality",
>>>>>>> fe4b28d52bbb394f8f7ac16db786decf72118101
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoginProvider>
          <ConditionalLayout>
            <QueryProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </QueryProvider>
          </ConditionalLayout>
        </LoginProvider>
      </body>
    </html>
  );
}
