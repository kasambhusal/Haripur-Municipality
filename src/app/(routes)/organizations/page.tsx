import Organizations from "@/ui/Organizations";
import React from "react";

export default function page() {
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full lg:w-8/10">
        <Organizations />
      </div>
    </div>
  );
}
