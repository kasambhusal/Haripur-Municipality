"use client";

import React, { useEffect, useState } from "react";
import { Users, Home, Plane, UserPlus, GraduationCap } from "lucide-react";

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

interface DemographicsTotals {
  population: {
    total: number;
    households: number;
  };
  education: {
    illiterate: number;
    bachelor_plus: number;
  };
  employment: {
    foreign_employed: number;
  };
}

interface ApiResponse {
  metadata: {
    totals: {
      demographics: DemographicsTotals;
    };
  };
  ward_wise_data: WardData[];
}

interface OverallStats {
  house_size: string,
  foreign_employment: number,
  education: number
}

export default function Hero3({setData}: {setData: React.Dispatch<React.SetStateAction<OverallStats | null>>}) {
  const [warddata, setWarddata] = useState<WardData[]>([]);
  const [totals, setTotals] = useState<DemographicsTotals | null>(null);
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
        setTotals(result.metadata.totals.demographics);
        setWarddata(result.ward_wise_data);
        setData({
            house_size: (result.metadata.totals.demographics.population.total / result.metadata.totals.demographics.population.households).toFixed(1),
            foreign_employment: result.metadata.totals.demographics.employment.foreign_employed,
            education: result.metadata.totals.demographics.education.bachelor_plus
        })
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
      <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-lg font-medium text-gray-600">विवरण प्राप्त गरिँदैछ...</h2>
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

  // Calculate average household size
  const avgHouseholdSize = totals 
    ? (totals.population.total / totals.population.households).toFixed(1) 
    : "0";

  return (
    <section className="w-full py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     

      {/* --- Ward-wise Section --- */}
      <div>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">वडागत विवरण</h2>
          <p className="text-gray-500 text-sm mt-1">
            प्रत्येक वडाको घरधुरी र जनसंख्याको संक्षिप्त जानकारी
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {warddata.map((wardInfo) => (
            <div
              key={wardInfo.ward}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
                  वडा नं. {wardInfo.ward}
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Users size={18} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">जनसंख्या</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {wardInfo.demographics.population.total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Home size={18} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">घरधुरी</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {wardInfo.households.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}