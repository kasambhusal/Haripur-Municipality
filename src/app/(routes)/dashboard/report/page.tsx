// app/report-link/page.tsx   (or any route you like)
"use client";

import Link from "next/link";
import { Card, Button } from "antd";
import { File } from "lucide-react";

export default function Page() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
      <Card
        variant="outlined"
        className="w-full max-w-md rounded-md shadow-lg"
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <File />
            हरिपुर नगरपालिका – वस्तुस्थिति विवरण
          </div>
        }
      >
        <p className="mb-6 leading-relaxed">
          वस्तुस्थिति विवरण हेर्न वा डाउनलोड गर्न तलको बटन थिच्नुहोस्।
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/report/a7Gk3Pq2/report.html" target="_blank">
            <Button type="primary" icon={<File />} size="large" block>
              रिपोर्ट हेर्नुहोस्
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
