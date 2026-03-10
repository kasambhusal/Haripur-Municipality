"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import navData from "@/data/BottomNav.json";
import type { NavData, DropdownNavItem, NavItem } from "../types/nav";

const BottomNav = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Type assertion for the imported JSON data
  const typedNavData = navData as NavData;

  const handleMouseEnter = (label: string) => {
    setHoveredItem(label);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Type guard function to check if item is a dropdown - Fixed the 'any' type
  const isDropdownItem = (item: NavItem): item is DropdownNavItem => {
    return item.type === "dropdown";
  };

  return (
    <nav
      className="w-full overflow-x-auto bg-white border-t border-gray-100 shadow-xl h-[40px] flex justify-center items-center"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-9/10 lg:w-8/10 pl-[20px] lg:pl-0">
        <div className="flex items-center justify-between ">
          {/* Navigation Items */}
          <ul className="flex items-center space-x-12">
            {typedNavData.navData.map((item, index) => {
              if (item.type === "link") {
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-[#002c58] hover:text-gray-900 font-semibold text-base transition-colors duration-200 py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              } else if (item.type === "dropdown") {
                // Type guard ensures TypeScript knows this is a DropdownNavItem
                const dropdownItem = isDropdownItem(item) ? item : null;

                return (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="flex items-center gap-2 text-[#002c58] hover:text-gray-900 font-medium text-base transition-colors duration-200 py-2">
                      <span className="font-semibold">{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          hoveredItem === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu - Only render if sub exists and has items */}
                    {dropdownItem?.sub &&
                      Array.isArray(dropdownItem.sub) &&
                      dropdownItem.sub.length > 0 && (
                        <div
                          className={`absolute top-2/3 left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-200 ease-out ${
                            hoveredItem === item.label
                              ? "opacity-100 translate-y-0 visible"
                              : "opacity-0 translate-y-2 invisible"
                          }`}
                        >
                          <div className="py-1">
                            <ul role="menu" className="space-y-1">
                              {dropdownItem.sub.map((subItem, subIndex) => (
                                <li key={subIndex} role="none">
                                  <Link
                                    href={subItem.href}
                                    className="block px-4 py-2 mx-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:bg-gray-50 focus:text-gray-900 transition-all duration-150 rounded-lg"
                                    role="menuitem"
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                  </li>
                );
              }
              return null;
            })}
          </ul>

          {/* Login Button */}
          <div>
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-medium text-gray-700"
            >
              लगिन
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
