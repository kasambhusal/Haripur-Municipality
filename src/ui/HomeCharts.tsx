"use client";

import { HistogramChart } from "@/components/charts/histogram-chart";
import { HalfDonutChart } from "@/components/charts/half-donut-chart";
import { PieChartComponent } from "@/components/charts/pie-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { useGraphsData } from "@/hooks/use-graph-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function HomeCharts() {
  // Get dynamic data from API
  const {
    data: graphsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGraphsData();

  // Your original sample data as fallback
  const fallbackData = {
    genderData: [
      { name: "पुरुष", value: 13113, color: "#3B82F6" },
      { name: "महिला", value: 12343, color: "#EC4899" },
      { name: "अन्य", value: 18, color: "#10B981" },
    ],
    wardData: [
      { category: "वार्ड २", value: 2655, color: "#3B82F6" },
      { category: "वार्ड ३", value: 2829, color: "#10B981" },
      { category: "वार्ड ४", value: 3651, color: "#F59E0B" },
      { category: "वार्ड ५", value: 2192, color: "#EF4444" },
      { category: "वार्ड ६", value: 5034, color: "#8B5CF6" },
      { category: "वार्ड ७", value: 4945, color: "#06B6D4" },
      { category: "वार्ड ८", value: 2871, color: "#84CC16" },
      { category: "वार्ड ९", value: 1129, color: "#F97316" },
    ],
    casteData: [
      { name: "थारू", value: 7107, color: "#3B82F6" },
      { name: "मुसलमान", value: 5781, color: "#10B981" },
      { name: "अन्य", value: 4560, color: "#F59E0B" },
      {
        name: "दलित (चमार, मुसहर, पासवान, आदि)",
        value: 3442,
        color: "#EF4444",
      },
      {
        name: "जनजाति (तामाङ, मगर, गुरुङ, आदि)",
        value: 1653,
        color: "#8B5CF6",
      },
      { name: "यादव", value: 1573, color: "#06B6D4" },
      { name: "ब्राह्मण/क्षेत्री", value: 1046, color: "#84CC16" },
    ],
    religionData: [
      { range: "हिन्दु", frequency: 18778, color: "#3B82F6" },
      { range: "मुस्लिम", frequency: 5743, color: "#10B981" },
      { range: "बौद्ध", frequency: 558, color: "#F59E0B" },
      { range: "अन्य", frequency: 140, color: "#EF4444" },
      { range: "इसाई", frequency: 14, color: "#8B5CF6" },
    ],
  };

  // Use API data if available, otherwise use fallback
  const currentData = graphsData || fallbackData;

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            स्थानीय सरकार डाटा भिजुअलाइजेसन ड्यासबोर्ड
          </h1>
          <p className="text-gray-600">
            निर्यात कार्यक्षमता सहित अन्तरक्रियात्मक चार्टहरू
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">
              सरकारी डाटा लोड हुँदै
            </h3>
            <p className="text-sm text-gray-600">
              हरिपुर नगरपालिकाबाट नवीनतम तथ्याङ्कहरू ल्याउँदै...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            स्थानीय सरकार डाटा भिजुअलाइजेसन ड्यासबोर्ड
          </h1>
          <p className="text-gray-600">
            निर्यात कार्यक्षमता सहित अन्तरक्रियात्मक चार्टहरू
          </p>
        </div>

        <Card className="max-w-md mx-auto border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2 text-red-900">
              डाटा लोडिङ त्रुटि
            </h3>
            <p className="text-sm text-red-600 mb-4">
              {error?.message ||
                "सरकारी डाटा लोड गर्न असफल। क्यास गरिएको जानकारी प्रयोग गर्दै।"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-red-300 text-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              पुनः प्रयास गर्नुहोस्
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          वस्तुस्थिति विवरणहरु
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Allocation - Using gender data for half donut */}
        <HalfDonutChart
          data={currentData.genderData}
          title="लिङ्गका आधारमा जनसंख्या वितरण"
        />

        {/* Department Spending - Using caste data for pie chart */}
        <PieChartComponent
          data={currentData.casteData}
          title="जातीय जनसंख्या वितरण"
        />
        {/* Population Distribution - Using religion data for histogram */}
        <HistogramChart
          data={currentData.religionData}
          title="धर्मका आधारमा जनसंख्या वितरण"
          xAxisLabel="धर्म"
          yAxisLabel="जनसंख्या"
        />
        {/* Quarterly Revenue - Using ward data for bar chart */}
        <BarChartComponent
          data={currentData.wardData}
          title="वार्डगत जनसंख्या वितरण"
          xAxisLabel="वार्ड"
          yAxisLabel="जनसंख्या"
        />
      </div>
    </div>
  );
}
