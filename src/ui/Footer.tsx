"use client";
import type React from "react";
import Link from "next/link";
import { Mail, Phone, X } from "lucide-react";

interface ContactInfo {
  phone: string;
  email: string;
  address?: string; // Optional address field
}

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  platform: "twitter" | "facebook";
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  contactInfo?: ContactInfo;
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  organizationName?: string;
}

const defaultContactInfo: ContactInfo = {
  phone: "+977-1-4211234",
  email: "info@haripurmun.gov.np",
  address: "हरिपुर नगरपालिका, सर्लाही, मधेश प्रदेश", // Optional address
};

const defaultLinks: FooterLink[] = [
  { label: "गृहपृष्ठ", href: "/" },
  { label: "नक्सा", href: "/map" },
  { label: "संघ संस्था", href: "/organizations" },
  { label: "योजना", href: "/plans" },
  { label: "सम्पर्क", href: "/contact" },
];

// Custom Facebook icon as SVG
const FacebookIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const defaultSocialLinks: SocialLink[] = [
  {
    platform: "twitter",
    href: "https://x.com/haripurmun",
    icon: <X className="w-6 h-6" />,
  },
  {
    platform: "facebook",
    href: "https://www.facebook.com/haripurmun",
    icon: <FacebookIcon />,
  },
];

export default function Footer({
  contactInfo = defaultContactInfo,
  links = defaultLinks,
  socialLinks = defaultSocialLinks,
  copyrightText = "Copyright © 2025 . All Rights Reserved.",
  organizationName = "Haripur Municipality",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6">सम्पर्क ठेगाना</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-white/90 hover:text-white transition-colors duration-200"
                  aria-label={`फोन गर्नुहोस् ${contactInfo.phone}`}
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/90 hover:text-white transition-colors duration-200 break-all"
                  aria-label={`इमेल पठाउनुहोस् ${contactInfo.email}`}
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {/* Location icon as SVG */}
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21c-4.418 0-8-5.373-8-9.5A8 8 0 1 1 20 11.5C20 15.627 16.418 21 12 21z"
                    />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                </div>
                <span className="text-white/90 break-words">
                  {contactInfo.address}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6">लिङ्कहरू</h3>
            <nav className="space-y-3" aria-label="Footer navigation">
              {links.map((link, index) => (
                <div key={index}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors duration-200 block py-1"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6">सामाजिक सञ्जाल</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label={`${social.platform} मा फलो गर्नुहोस्`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="text-center text-white/80 text-sm">
            <p>
              {copyrightText.replace("2025", currentYear.toString())}{" "}
              {organizationName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
