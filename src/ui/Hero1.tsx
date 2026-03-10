"use client";

import HeroCard from "@/components/HeroCard";
import { useMunicipalityStats } from "@/hooks/use-municipality-stats";
import {
  Home,
  Users,
  User,
  UserCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero1 = () => {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useMunicipalityStats();

  // Fallback data in case API fails
  const fallbackData = {
    households: 8390,
    totalPopulation: 43223,
    malePopulation: 21141,
    femalePopulation: 22012,
  };

  const currentStats = stats || fallbackData;

  const statsData = [
    {
      icon: Home,
      title: "घरधुरी",
      number: currentStats.households,
    },
    {
      icon: Users,
      title: "जनसंख्या",
      number: currentStats.totalPopulation,
    },
    {
      icon: User,
      title: "पुरुष संख्या",
      number: currentStats.malePopulation,
    },
    {
      icon: UserCheck,
      title: "महिला संख्या",
      number: currentStats.femalePopulation,
    },
  ];

  return (
    <section
      className="w-full bg-[#002c58] py-12 lg:py-16 px-6 lg:px-12"
      style={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.25)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side - Welcome Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col gap-3 items-center lg:items-start">
          <h1
            className="text-3xl lg:text-5xl font-bold text-white"
            style={{ lineHeight: "1.2" }}
          >
            हरिपुर नगरपालिकाको
          </h1>
          <h2
            className="text-3xl lg:text-5xl font-bold text-yellow-400"
            style={{ lineHeight: "1.2" }}
          >
            डिजिटल प्रोफाइलमा
          </h2>
          <p
            className="text-2xl lg:text-5xl text-white"
            style={{ lineHeight: "1.2" }}
          >
            तपाईंलाई स्वागत छ ।
          </p>

          {/* Data Source Indicator */}
          <div className="flex items-center gap-2 mt-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading latest data...</span>
              </div>
            )}
            {isError && (
              <div className="flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Using cached data</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-red-200 hover:text-white hover:bg-red-600/20 h-6 px-2"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Stats Grid */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-2 gap-4 lg:gap-6 max-w-lg mx-auto">
            {statsData.map((stat, index) => (
              <HeroCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                number={stat.number}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
