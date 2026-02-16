"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartMenu } from "./chart-menu";
import { toNepaliNumber, formatNepaliNumber } from "@/utils/NumberConvert";

interface PieData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  data: PieData[];
  title?: string;
  className?: string;
}

export function PieChartComponent({
  data,
  title = "पाई चार्ट",
  className,
}: PieChartComponentProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [chartId, setChartId] = useState<string>("");

  useEffect(() => {
    const id = `pie-chart-${Date.now()}-${Math.random()
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
    config[item.name] = {
      label: item.name,
      color: item.color || vibrantColors[index % vibrantColors.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const handleSegmentClick = (data: PieData) => {
    setActiveSegment(activeSegment === data.name ? null : data.name);
  };

  if (!chartId) return null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-base truncate font-bold">
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
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  dataKey="value"
                  onClick={handleSegmentClick}
                  className="cursor-pointer transition-all duration-200"
                  label={({ name, value }) => {
                    const total = data.reduce(
                      (sum, entry) => sum + entry.value,
                      0
                    );
                    const percent = ((value / total) * 100).toFixed(1);
                    return `${name}: ${toNepaliNumber(percent)}%`;
                  }}
                  labelLine={false}
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
                          activeSegment === null || activeSegment === entry.name
                            ? 1
                            : 0.7
                        }
                        stroke={activeSegment === entry.name ? "#000" : "none"}
                        strokeWidth={activeSegment === entry.name ? 2 : 0}
                        className="hover:brightness-110 transition-all duration-200"
                      />
                    );
                  })}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as PieData;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold text-sm">{data.name}</p>

                          <p className="text-sm text-gray-600">
                            <span className="font-medium">संख्या:</span>{" "}
                            {formatNepaliNumber(data.value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  iconType="circle"
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span style={{ color: "#374151" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
