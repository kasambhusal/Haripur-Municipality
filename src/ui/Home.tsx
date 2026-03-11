"use client";
import React, { useState } from "react";
import Hero2 from "./Hero2";
import Hero1 from "./Hero1";
import HomeCharts from "./HomeCharts";
import { HomeMembers } from "./HomeMembers";
import Hero3 from "./Hero3";
import Hero4 from "./Hero4";

interface OverallStats {
  house_size: string,
  foreign_employment: number,
  education: number
}
export default function Home() {
  const [data, setData] = useState<OverallStats | null>(null);
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 w-full flex justify-center">
      <div className="w-full lg:w-8/10">
        <Hero1 />
        <Hero2/>
        <Hero3 setData={setData} />
        <HomeCharts />
        <Hero4 data={data} />
        <HomeMembers />
      </div>
    </div>
  );
}
