import Image from "next/image";
import React from "react";

export default function TopNav() {
  return (
    <div className="w-full flex justify-center top-nav">
      <div className="w-20/19 lg:w-8/10 flex items-center h-[100px] justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/nepal_logo.png"
            width={100}
            height={84}
            alt="Nepal Logo"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-l sm:text-xl md:text-2xl font-semibold  text-center municipality-text">
              हरिपुर नगरपालिका,नगर कार्यपालिकाको कार्यालय{" "}
            </h2>
            <p className="text-sm md:text-[14px] italic municipality-text">
              &quot; स्वच्छ ! सुन्दर !! समुन्नत !! हरिपुर !!! &quot;
            </p>
          </div>
        </div>
        <div className="w-[110px] h-[90px] relative">
          <Image
            src="/assets/images/haripur_logo.png"
            alt="Haripur Logo"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
