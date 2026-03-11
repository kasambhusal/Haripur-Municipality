"use client";
import { Users, Home, Plane, UserPlus, GraduationCap } from "lucide-react";

interface OverallStats {
  house_size: string,
  foreign_employment: number,
  education: number
}

const Hero4 = ({data}: {data: OverallStats | null}) => {
  return (
    <>
      <div className="mb-10">
        
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Household Size Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <UserPlus size={80} />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">औसत परिवार आकार</p>
                  <p className="text-2xl font-bold text-gray-900">{data.house_size} जना</p>
                </div>
              </div>
            </div>

            {/* Foreign Employment Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plane size={80} />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <Plane size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">वैदेशिक रोजगार</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.foreign_employment.toLocaleString("en-IN")} जना
                  </p>
                </div>
              </div>
            </div>

            {/* Education (Bachelor Plus) Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <GraduationCap size={80} />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">स्नातक वा सोभन्दा माथि</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.education.toLocaleString("en-IN")} जना
                  </p>
                </div>
              </div>
            </div>
          </div>
        ): <div className="pl-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> </div>}
      </div>

      <hr className="border-gray-200 mb-10" />
      </>
  );
};

export default Hero4;
