"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface MemberCardProps {
  name: string;
  position: string;
  phone: string;
  email?: string;
  address?: string;
  imageUrl: string;
  identity: string;
  headerColor: string;
  className?: string;
}

export function MemberCard({
  name,
  position,
  phone,
  identity,
  email,
  address = "हरिपुर",
  imageUrl,
  headerColor,
  className,
}: MemberCardProps) {
  return (
    <Card className={`overflow-hidden text-center ${className} p-0`}>
      {/* Top Header Color Section with Identity Text */}
      <div
        className="h-28 w-full rounded-t-xl flex items-center justify-center"
        style={{ backgroundColor: headerColor }}
      >
        <span className="text-white text-lg font-bold drop-shadow-sm">
          {identity}
        </span>
      </div>

      {/* Image in Circle Overlapping Header */}
      <div className="-mt-12 flex justify-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={96}
            height={96}
            priority
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Content Below Image */}
      <CardContent className="pt-4 pb-6 px-6">
        <h3 className="text-xl font-extrabold text-black">{name}</h3>
        <p className="text-md font-medium text-gray-800">{position}</p>

        <div className="mt-4 text-left space-y-2 text-sm font-semibold text-black">
          <p>ठेगाना : {address}</p>
          <p>सम्पर्क नं : {phone}</p>
          {email && <p>ईमेल : {email}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
