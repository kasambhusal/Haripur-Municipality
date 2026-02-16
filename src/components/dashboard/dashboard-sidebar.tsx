"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  ClipboardPlus,
  Settings,
  BarChart3,
  MessageSquare,
  Building,
  X,
  ChevronDown,
  ChevronRight,
  User2,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: SidebarItem[];
}

const navigation: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Report", href: "/dashboard/report", icon: ClipboardPlus },
  { name: "Plans", href: "/dashboard/plans", icon: BarChart3 },
  {
    name: "Organization",
    icon: Building,
    href: "/dashboard/organization",
  },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
  { name: "Profile", href: "/dashboard/profile", icon: User2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavItem = (item: SidebarItem, level = 0) => {
    const isActive = item.href === pathname;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            className={cn(
              "w-full flex items-center justify-start text-left font-normal px-3 py-2 rounded-md transition-colors",
              level > 0 && "ml-4",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
            onClick={() => toggleExpanded(item.name)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
            {isExpanded ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children?.map((child) => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={item.name} href={item.href!} className="block">
        <div
          className={cn(
            "w-full flex items-center justify-start text-left font-normal px-3 py-2 rounded-md transition-colors",
            level > 0 && "ml-4",
            isActive
              ? "bg-[#002c58] text-white hover:bg-[#003d73]"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.name}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="text-xl font-bold text-[#002c58]">
              हरिपुर नगरपालिका
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>{renderNavItem(item)}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Header with close button */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <h2 className="text-xl font-bold text-[#002c58]">
              हरिपुर नगरपालिका
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>{renderNavItem(item)}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
