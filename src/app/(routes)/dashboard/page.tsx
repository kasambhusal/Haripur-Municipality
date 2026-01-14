import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  House,
  Home,
  GraduationCap,
  IdCardLanyard,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Get } from "@/lib/api";

interface ReportsData {
  metadata: {
    total_households: number;
    total_population: number;
    total_male: number;
    total_female: number;
    wards_included: number[];
    totals: {
      demographics: {
        population: {
          total: number;
          male: number;
          female: number;
          households: number;
        };
        education: {
          illiterate: number;
          bachelor_plus: number;
        };
        employment: {
          foreign_employed: number;
        };
      };
    };
  };
  ward_wise_data: Array<{
    ward: number;
    households: number;
    demographics: {
      population: {
        total: number;
        male: number;
        female: number;
      };
    };
  }>;
}

async function getReportsData(): Promise<ReportsData | null> {
  try {
    const data = (await Get({ url: "/public/reports/" })) as ReportsData;
    return data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const reportsData = await getReportsData();

  // Calculate key statistics
  const totalPopulation = reportsData?.metadata.total_population || 0;
  const totalHouseholds = reportsData?.metadata.total_households || 0;
  const totalMale = reportsData?.metadata.total_male || 0;
  const totalFemale = reportsData?.metadata.total_female || 0;
  const totalWards = reportsData?.metadata.wards_included.length || 0;
  const graduateCount =
    reportsData?.metadata?.totals?.demographics.education?.bachelor_plus || 0;
  const foreignEmployed =
    reportsData?.metadata?.totals?.demographics?.employment?.foreign_employed || 0;

  const stats = [
    {
      name: "कुल जनसंख्या",
      value: totalPopulation.toLocaleString(),
      icon: Users,
      description: "Total Population",
      color: "text-blue-600",
    },
    {
      name: "कुल घरधुरी",
      value: totalHouseholds.toLocaleString(),
      icon: Home,
      description: "Total Households",
      color: "text-green-600",
    },
    {
      name: "वडा संख्या",
      value: totalWards.toString(),
      icon: MapPin,
      description: "Total Wards",
      color: "text-orange-600",
    },
  ];

  const demographics = [
    {
      label: "पुरुष",
      value: totalMale.toLocaleString(),
      percentage:
        totalPopulation > 0
          ? Math.round((totalMale / totalPopulation) * 100)
          : 0,
    },
    {
      label: "महिला",
      value: totalFemale.toLocaleString(),
      percentage:
        totalPopulation > 0
          ? Math.round((totalFemale / totalPopulation) * 100)
          : 0,
    },
  ];

  // Get the top 3 wards by population
  const topWards =
    reportsData?.ward_wise_data
      ?.sort(
        (a, b) =>
          b.demographics.population.total - a.demographics.population.total
      )
      ?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          हरिपुर नगरपालिका ड्यासबोर्ड
        </h1>
        <p className="text-gray-600">नगरपालिकाको तथ्याङ्क र जानकारी</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6  lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                    <dd className="text-xs text-gray-400 mt-1">
                      {stat.description}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demographics and Key Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              लैंगिक वितरण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demographics.map((demo) => (
                <div
                  key={demo.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {demo.label}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {demo.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({demo.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Wards by Population */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              जनसंख्या अनुसार शीर्ष वडाहरू
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWards.map((ward, index) => (
                <div
                  key={ward.ward}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        वडा नं. {ward.ward}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ward.households} घरधुरी
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {ward.demographics.population.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">जनसंख्या</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">स्नातक तह</p>
                <p className="text-2xl font-bold">
                  {graduateCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Bachelor+ Graduates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IdCardLanyard className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  वैदेशिक रोजगार
                </p>
                <p className="text-2xl font-bold">
                  {foreignEmployed.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Foreign Employment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <House className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">औसत घर आकार</p>
                <p className="text-2xl font-bold">
                  {totalHouseholds > 0
                    ? Math.round(totalPopulation / totalHouseholds)
                    : 0}
                </p>
                <p className="text-xs text-gray-500">Average Household Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Status */}
      {reportsData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                कुल {reportsData.metadata.wards_included.length} वडाको डेटा
                समावेश
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
