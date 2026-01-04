import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { date: "Jan 02", views: 240, responses: 120 },
  { date: "Jan 03", views: 300, responses: 139 },
  { date: "Jan 04", views: 200, responses: 980 },
  { date: "Jan 05", views: 278, responses: 390 },
  { date: "Jan 06", views: 189, responses: 480 },
  { date: "Jan 07", views: 239, responses: 380 },
  { date: "Jan 08", views: 349, responses: 430 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "#94a3b8",
  },
  responses: {
    label: "Responses",
    color: "#10b981",
  },
} satisfies ChartConfig;

export function PerformanceTrendChart() {
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Performance Trend
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-0.5 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium bg-white text-gray-900 rounded shadow-sm">
                7d
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">
                30d
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-dashed gap-1">
              <Clock className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-gray-500">
              Compare <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Views vs Responses over the chart
        </div>
      </CardHeader>
      <CardContent className="pl-0 pb-0">
        <div className="h-[280px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                dx={-10}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#94a3b8"
                strokeWidth={2}
                fill="url(#fillViews)"
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#fillResponses)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
