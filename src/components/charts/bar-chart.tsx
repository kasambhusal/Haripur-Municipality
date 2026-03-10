"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartMenu } from "./chart-menu";
import { toNepaliNumber, formatNepaliNumber } from "@/utils/NumberConvert";

interface BarData {
  category: string;
  value: number;
  color?: string;
}

interface BarChartComponentProps {
  data: BarData[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

export function BarChartComponent({
  data,
  title = "बार चार्ट",
  xAxisLabel = "श्रेणी",
  yAxisLabel = "मान",
  className,
}: BarChartComponentProps) {
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [chartId, setChartId] = useState<string>("");

  useEffect(() => {
    const id = `bar-chart-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setChartId(id);
  }, []);

  const chartConfig = data.reduce((config, item, index) => {
    const vibrantColors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#84CC16",
      "#F97316",
      "#EC4899",
      "#6366F1",
    ];
    config[item.category] = {
      label: item.category,
      color: item.color || vibrantColors[index % vibrantColors.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const handleBarClick = (data: BarData) => {
    setActiveBar(activeBar === data.category ? null : data.category);
  };

  if (!chartId) return null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-base font-bold truncate">
          {title}
        </CardTitle>
        <ChartMenu
          elementId={chartId}
          filename={title.toLowerCase().replace(/\s+/g, "-")}
        />
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div
          id={chartId}
          data-chart-id={chartId}
          className="chart-container w-full"
        >
          <ChartContainer
            config={chartConfig}
            className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10 }}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  height={window.innerWidth < 640 ? 80 : 60}
                  interval={0}
                  label={{
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -5,
                    style: {
                      textAnchor: "middle",
                      fontSize: "12px",
                      fill: "#6B7280",
                    },
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  width={window.innerWidth < 640 ? 50 : 70}
                  tickFormatter={(value) => toNepaliNumber(value)}
                  label={{
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: "12px",
                      fill: "#6B7280",
                    },
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const total = data.reduce(
                        (sum, item) => sum + item.value,
                        0
                      );
                      const barData = payload[0].payload as BarData;
                      const percent = ((barData.value / total) * 100).toFixed(
                        1
                      );

                      return (
                        <div className="bg-white p-3 border rounded shadow-lg text-sm">
                          <p className="font-semibold">{barData.category}</p>
                          <p className="text-gray-600">
                            <span className="font-medium">{yAxisLabel}:</span>{" "}
                            {formatNepaliNumber(barData.value)}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">प्रतिशत:</span>{" "}
                            {toNepaliNumber(percent)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />

                <Bar
                  dataKey="value"
                  onClick={handleBarClick}
                  className="cursor-pointer transition-all duration-200"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => {
                    const vibrantColors = [
                      "#3B82F6",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                      "#84CC16",
                      "#F97316",
                      "#EC4899",
                      "#6366F1",
                    ];
                    const baseColor =
                      entry.color ||
                      vibrantColors[index % vibrantColors.length];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={baseColor}
                        opacity={
                          activeBar === null || activeBar === entry.category
                            ? 1
                            : 0.7
                        }
                        className="hover:brightness-110 transition-all duration-200"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
