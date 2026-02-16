"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Phone, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002c58] to-gray-600 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo/Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            हरिपुर नगरपालिका
          </h1>
          <p className="text-blue-100 text-lg">Haripur Municipality</p>
        </div>

        {/* 404 Card */}
        <Card className="shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* 404 Number */}
            <div className="mb-6">
              <h2 className="text-8xl md:text-9xl font-bold text-[#002c58] mb-4">
                404
              </h2>
              <div className="w-24 h-1 bg-[#002c58] mx-auto mb-6"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                पृष्ठ फेला परेन
              </h3>
              <h4 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                Page Not Found
              </h4>
              <p className="text-gray-600 text-lg mb-2">
                माफ गर्नुहोस्, तपाईंले खोज्नुभएको पृष्ठ अवस्थित छैन।
              </p>
              <p className="text-gray-600">
                Sorry, the page you are looking for doesn&apos;t exist or has
                been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button className="bg-[#002c58] hover:bg-[#003d73] text-white px-6 py-3 text-lg">
                  <Home className="h-5 w-5 mr-2" />
                  मुख्य पृष्ठ / Home
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-[#002c58] text-[#002c58] hover:bg-[#002c58] hover:text-white px-6 py-3 text-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                पछाडि जानुहोस् / Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="border-t border-gray-200 pt-8">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">
                उपयोगी लिङ्कहरू / Helpful Links
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Link
                  href="/contact"
                  className="flex items-center text-[#002c58] hover:text-[#003d73] transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  सम्पर्क / Contact
                </Link>

                <Link
                  href="/login"
                  className="flex items-center text-[#002c58] hover:text-[#003d73] transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  लगिन / Login
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                सहायताको लागि सम्पर्क गर्नुहोस् / For assistance, please
                contact:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>+977-1-XXXXXXX</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>info@haripurmun.gov.np</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            © 2024 हरिपुर नगरपालिका | Haripur Municipality
          </p>
          <p className="text-blue-200 text-xs mt-1">
            सबै अधिकार सुरक्षित | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
