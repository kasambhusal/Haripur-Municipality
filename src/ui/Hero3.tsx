"use client";

import React, { useEffect, useState } from "react";
import { Users, Home } from "lucide-react";

// Define the TypeScript interfaces based on your API response
interface WardData {
  ward: number;
  households: number;
  demographics: {
    population: {
      total: number;
    };
  };
}

interface ApiResponse {
  ward_wise_data: WardData[];
}

export default function Hero3() {
  const [data, setData] = useState<WardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          "https://api.bhuvanpaudel.com.np/haripur/api/v1/public/reports/"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: ApiResponse = await response.json();
        setData(result.ward_wise_data);
      } catch (err) {
        setError("डेटा लोड गर्न समस्या भयो। (Failed to load data.)");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-10">
        <h2>वडागत विवरण प्राप्त गरिँदैछ...</h2><br />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-500 py-10">
        {error}
      </div>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">वडागत विवरण</h2>
        <p className="text-gray-500 text-sm mt-1">
          प्रत्येक वडाको घरधुरी र जनसंख्याको संक्षिप्त जानकारी
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((wardInfo) => (
          <div
            key={wardInfo.ward}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                वडा नं. {wardInfo.ward}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">जनसंख्या</p>
                  <p className="text-lg font-bold text-gray-900">
                    {wardInfo.demographics.population.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Home size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">घरधुरी</p>
                  <p className="text-lg font-bold text-gray-900">
                    {wardInfo.households.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}