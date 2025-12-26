import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Eye,
  MoreVertical,
  Settings,
  Share2,
  Users,
  Sparkles,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const searchSchema = z.object({
  tab: z.enum(["overview", "responses"]).optional().catch("overview"),
});

export const Route = createFileRoute("/_protected/forms/$formId/")({
  component: FormDashboard,
  validateSearch: (search) => searchSchema.parse(search),
});

const chartData = [
  { date: "Jan 02", views: 240, responses: 120 },
  { date: "Jan 03", views: 300, responses: 139 },
  { date: "Jan 04", views: 200, responses: 980 },
  { date: "Jan 05", views: 278, responses: 390 },
  { date: "Jan 06", views: 189, responses: 480 },
  { date: "Jan 07", views: 239, responses: 380 },
  { date: "Jan 08", views: 349, responses: 430 },
];

function FormDashboard() {
  const { formId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = search.tab || "overview";

  return (
    <Tabs
      value={tab}
      onValueChange={(value) =>
        navigate({
          search: (prev) => ({
            ...prev,
            tab: value as "overview" | "responses",
          }),
        })
      }
      className="min-h-screen bg-gray-50/50 text-foreground flex flex-col font-sans"
    >
      {/* Top Navigation / Header */}
      <DashboardHeader formId={formId} />

      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* KPI / Stats Section */}
          <StatsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Main Performance Chart */}
              <PerformanceTrendChart />

              {/* Drop-off Analysis */}
              {/* <DropoffAnalysis /> */}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Components */}
              <FormHealth />
              <Insights />
              {/* <Suggestions /> */}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="mt-0">
          <RecentResponses />
        </TabsContent>
      </main>
    </Tabs>
  );
}

function DashboardHeader({ formId }: { formId: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background px-6 py-3">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full relative">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/forms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forms
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground flex items-center gap-2">
                  Form {formId.slice(0, 8)}...
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <TabsList className="bg-gray-100/50 border border-gray-200/50 h-9">
            <TabsTrigger value="overview" className="px-4 text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="responses" className="px-4 text-xs">
              Responses
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          >
            <Eye className="mr-2 h-4 w-4 text-gray-500" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          >
            <Share2 className="mr-2 h-4 w-4 text-gray-500" />
            Share
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <Button
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm"
          >
            <Compass className="mr-2 h-4 w-4" />
            Next Steps
            <ChevronDown className="ml-2 h-3 w-3 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function StatsOverview() {
  const dropOffPoints = {
    Start: {
      questionIndex: 0,
      reached: 2543,
      exited: 743,
    },
    "Personal Info": {
      questionIndex: 1,
      reached: 1800,
      exited: 600,
    },
    Preferences: {
      questionIndex: 2,
      reached: 1200,
      exited: 400,
    },
    Feedback: {
      questionIndex: 3,
      reached: 800,
      exited: 50,
    },
  };
  //   const dropOffPoints = {
  //   Start: {
  //     questionIndex: 0,
  //     reached: 2543,
  //     exited: 73,
  //   },
  //   "Personal Info": {
  //     questionIndex: 1,
  //     reached: 1800,
  //     exited: 20,
  //   },
  //   Preferences: {
  //     questionIndex: 2,
  //     reached: 200,
  //     exited: 10,
  //   },
  //   Feedback: {
  //     questionIndex: 3,
  //     reached: 4000,
  //     exited: 100,
  //   },
  // };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TotalViewsCard />
      <ResponsesCard />
      <CompletionRateCard />
      <DropOffPointCard dropOffPoints={dropOffPoints} />
    </div>
  );
}

function TotalViewsCard() {
  const totalViews = 2543;
  const currentWeekViews = 1800;
  const lastWeekViews = 1200;
  const currentWeekDelta = currentWeekViews - lastWeekViews;
  const percentageChange = (currentWeekDelta / lastWeekViews) * 100;
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Views
          </CardTitle>
          <Activity className="h-4 w-4 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span
            className={cn(
              "font-medium",
              percentageChange > 0 ? "text-emerald-600" : "text-rose-600",
              percentageChange === 0 && "text-gray-400"
            )}
          >
            {percentageChange.toFixed(1)}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn(
              "font-medium",
              currentWeekDelta > 0 ? "text-emerald-600" : "text-rose-600",
              currentWeekDelta === 0 && "text-gray-400"
            )}
          >
            {currentWeekDelta > 0 ? "+" : ""}
            {currentWeekDelta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ResponsesCard() {
  const totalResponses = 1204;
  const currentWeekResponses = 90;
  const lastWeekResponses = 80;
  const currentWeekDelta = currentWeekResponses - lastWeekResponses;
  const percentageChange = (currentWeekDelta / lastWeekResponses) * 100;
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Responses
          </CardTitle>
          <Users className="h-4 w-4 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{totalResponses}</div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span
            className={cn(
              "font-medium",
              percentageChange > 0 ? "text-emerald-600" : "text-rose-600",
              percentageChange === 0 && "text-gray-400"
            )}
          >
            {percentageChange.toFixed(1)}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn(
              "font-medium",
              currentWeekDelta > 0 ? "text-emerald-600" : "text-rose-600",
              currentWeekDelta === 0 && "text-gray-400"
            )}
          >
            {currentWeekDelta > 0 ? "+" : ""}
            {currentWeekDelta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionRateCard() {
  const currentWeekCompletedResponses = 90;
  const currentWeekTotalClicks = 100;

  const lastWeekCompletedResponses = 80;
  const lastWeekTotalClicks = 100;

  const currentWeekCompletionRate =
    currentWeekCompletedResponses / currentWeekTotalClicks;

  const currentWeekCompletionRatePercentage = Math.floor(
    currentWeekCompletionRate * 100
  );

  const lastWeekCompletionRate =
    lastWeekCompletedResponses / lastWeekTotalClicks;

  const lastWeekCompletionRatePercentage = Math.floor(
    lastWeekCompletionRate * 100
  );

  const completionRateChangePercentage = Math.floor(
    ((currentWeekCompletionRate - lastWeekCompletionRate) /
      lastWeekCompletionRate) *
      100
  );

  function getRating(completionRate: number) {
    if (completionRate < 20) return "Poor";
    if (completionRate < 35) return "Below avg";
    if (completionRate < 50) return "Average";
    if (completionRate < 65) return "Above avg";
    if (completionRate < 85) return "Excellent";
    return "Superb";
  }

  const isPositiveChange =
    currentWeekCompletionRate - lastWeekCompletionRate > 0;

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Completion Rate
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {currentWeekCompletionRatePercentage}%
          </div>
          <div className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {getRating(currentWeekCompletionRatePercentage)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span
            className={cn("font-medium", {
              "text-rose-500": completionRateChangePercentage < 0,
              "text-emerald-500": completionRateChangePercentage > 0,
            })}
          >
            {completionRateChangePercentage}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn("font-medium", {
              "text-emerald-500": isPositiveChange,
              "text-rose-500 ": !isPositiveChange,
            })}
          >
            <span>{isPositiveChange ? "+" : "-"}</span>
            {Math.abs(
              currentWeekCompletionRatePercentage -
                lastWeekCompletionRatePercentage
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DropOffPointCardProps {
  dropOffPoints: Record<
    string,
    { reached: number; exited: number; questionIndex: number }
  >;
}

function DropOffPointCard({ dropOffPoints }: DropOffPointCardProps) {
  const getDropOffStatus = (rate: number) => {
    if (rate > 0.5)
      return {
        label: "Critical",
        color: "text-red-600",
        bg: "bg-red-50",
        progress: "from-red-400 to-red-600",
      };
    if (rate > 0.3)
      return {
        label: "High Impact",
        color: "text-orange-600",
        bg: "bg-orange-50",
        progress: "from-orange-400 to-orange-600",
      };
    if (rate > 0.2)
      return {
        label: "Moderate",
        color: "text-amber-600",
        bg: "bg-amber-50",
        progress: "from-amber-400 to-amber-600",
      };
    if (rate > 0.1)
      return {
        label: "Low Impact",
        color: "text-blue-600",
        bg: "bg-blue-50",
        progress: "from-blue-400 to-blue-600",
      };
    return {
      label: "Minimal",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      progress: "from-emerald-400 to-emerald-600",
    };
  };

  let maxRate = 0;
  let maxQuestion = "None";
  let questionIndex = -1;

  Object.keys(dropOffPoints).forEach((q) => {
    const r = dropOffPoints[q].reached || 0;
    const e = dropOffPoints[q].exited || 0;
    if (r > 0) {
      // DropOffRate(Qi) = Exited(Qi) / Reached(Qi)
      const rate = e / r;

      if (rate > maxRate) {
        /**
         * Drop-off Point (single worst offender)
         * DropOffPoint = Qi where DropOffRate(Qi) is MAX
         */
        maxRate = rate;
        maxQuestion = q; // single worst offender
        questionIndex = dropOffPoints[q].questionIndex;
      }
    }
  });

  const status = getDropOffStatus(maxRate);
  const percentage = Math.round(maxRate * 100);

  return (
    <Card className="shadow-sm border-gray-100 relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            Drop-off Point
          </CardTitle>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded border",
              status.bg,
              status.color,
              "border-opacity-20"
            )}
          >
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 mb-2">
          <span
            className={cn(
              "text-2xl font-bold px-1 rounded",
              status.bg,
              status.color
            )}
          >
            {percentage}%
          </span>
        </div>
        <Progress
          value={percentage}
          className="h-1.5 bg-gray-100"
          indicatorClassName={cn("bg-gradient-to-r", status.progress)}
        />
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>Drop-off Rate</span>
          <Tooltip>
            <TooltipTrigger>
              <span className={cn("flex items-center gap-1", status.color)}>
                Question {questionIndex + 1}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Question {questionIndex + 1}: {maxQuestion}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

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

function PerformanceTrendChart() {
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
              className="h-7 text-xs border-dashed gap-1"
            >
              <Clock className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-gray-500"
            >
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
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
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

// function DropoffAnalysis() {
//   return (
//     <Card className="shadow-sm border-gray-100">
//       <CardHeader className="flex flex-row items-center justify-between pb-6">
//         <CardTitle className="text-base font-semibold text-gray-900">
//           Drop-off Analysis
//         </CardTitle>
//         <Button variant="link" className="text-blue-500 text-xs h-auto p-0">
//           View Full Analysis &gt;
//         </Button>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Visual Bar Chart Mockup */}
//         <div className="space-y-4">
//           <div className="grid grid-cols-[100px_1fr_50px_50px] gap-4 items-center">
//             <span className="text-sm text-gray-500">Started</span>
//             <div className="h-8 w-full bg-slate-200 rounded flex items-center px-3 text-xs font-medium text-slate-600">
//               2543
//             </div>
//             <span className="text-xs text-emerald-600 text-right">+1.9%</span>
//             <span className="text-xs text-gray-400 text-right">32%</span>
//           </div>
//           <div className="grid grid-cols-[100px_1fr_50px_50px] gap-4 items-center">
//             <span className="text-sm text-gray-500">Q1</span>
//             <div className="flex w-full gap-1 h-8">
//               <div className="h-full bg-slate-400/80 rounded-l w-[75%] flex items-center justify-center text-xs text-white font-medium">
//                 1,928
//               </div>
//               <div className="h-full bg-red-100 rounded-r w-[25%] flex items-center justify-center text-xs text-red-600 font-medium relative group cursor-help">
//                 26%
//               </div>
//             </div>
//             <span className="text-xs text-emerald-600 text-right">+31%</span>
//             <span className="text-xs text-gray-400 text-right">37%</span>
//           </div>
//           <div className="grid grid-cols-[100px_1fr_50px_50px] gap-4 items-center">
//             <span className="text-sm text-gray-500">Q2</span>
//             <div className="flex w-full gap-1 h-8">
//               <div className="h-full bg-emerald-500/80 rounded-l w-[65%] flex items-center justify-center text-xs text-white font-medium">
//                 1,318
//               </div>
//               <div className="h-full bg-orange-100 rounded-r w-[35%] flex items-center justify-center text-xs text-orange-600 font-medium">
//                 32%
//               </div>
//             </div>
//             <span className="text-xs text-gray-300 text-right">-</span>
//             <span className="text-xs text-gray-400 text-right">14%</span>
//           </div>
//           <div className="grid grid-cols-[100px_1fr_50px_50px] gap-4 items-center">
//             <span className="text-sm text-gray-500">Q3</span>
//             <div className="flex w-full gap-1 h-8">
//               <div className="h-full bg-emerald-400/80 rounded-l w-[80%] flex items-center justify-center text-xs text-white font-medium">
//                 1,204
//               </div>
//               <div className="h-full bg-yellow-100 rounded-r w-[20%] flex items-center justify-center text-xs text-yellow-600 font-medium">
//                 14%
//               </div>
//             </div>
//             <div className="col-span-2 text-[10px] text-gray-400 text-right">
//               Most users abandon at Question 4
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

function FormHealth() {
  /**
   * Form health is calculated based on the following metrics:
   *
   * - CompletionScore = min(CompletionRate / BenchmarkRate, 1) × 100
   *
   * - DropOffSeverity = Max(DropOffRate(Qi))
   * - DropOffScore = (1 - DropOffSeverity) × 100
   *
   * - TimeRatio = AvgTime / ExpectedTime
   * - TimeScore = clamp(1 / TimeRatio, 0, 1) × 100
   *
   * - QualityScore = (HighQualityResponses / TotalResponses) × 100
   *
   * - ErrorRate = ErrorSubmissions / TotalAttempts
   * - ErrorScore = (1 - ErrorRate) × 100
   *
   * FormHealth =
   * - 0.35 × CompletionScore +
   * - 0.25 × DropOffScore +
   * - 0.20 × TimeScore +
   * - 0.10 × QualityScore +
   * - 0.10 × ErrorScore
   *
   */
  return (
    <Card className="shadow-sm border-gray-100 relative overflow-hidden">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[.1px]">
        <div className="bg-slate-9000 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Sparkles size={12} className="fill-yellow-500" />
          Coming Soon
        </div>
      </div>

      <CardHeader className="relative opacity-40">
        <CardTitle className="text-base font-semibold text-gray-900">
          Form Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative opacity-40 blur-[1px] select-none pointer-events-none">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">72</span>
          <span className="text-lg text-gray-400 mb-1">/100</span>
          <span className="text-xs text-emerald-600 mb-2 ml-auto font-medium">
            Improved by +6 this week
          </span>
        </div>
        <Progress
          value={72}
          className="h-2"
          indicatorClassName="bg-emerald-500"
        />
      </CardContent>
    </Card>
  );
}

/**
 * 
 *  <Card className="shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          Form Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">72</span>
          <span className="text-lg text-gray-400 mb-1">/100</span>
          <span className="text-xs text-emerald-600 mb-2 ml-auto font-medium">
            Improved by +6 this week
          </span>
        </div>
        <Progress
          value={72}
          className="h-2"
          indicatorClassName="bg-emerald-500"
        />
      </CardContent>
    </Card>
 */

function Insights() {
  return (
    <Card className="border-gray-100 border-none shadow-none bg-transparent">
      <CardHeader className="pl-0 pt-0">
        <CardTitle className="text-base font-semibold text-gray-900">
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0 space-y-4">
        <div className="flex gap-3 items-start">
          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Most users drop at Question 4, average time spent is 44s
          </p>
        </div>
        <div className="flex gap-3 items-start">
          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Mobile users convert 23% less than desktop
          </p>
        </div>
        <div className="flex gap-3 items-start">
          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Adding 3 logic jumps reduced conversion by 10%
          </p>
        </div>
        <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          Optimize Form
        </Button>
      </CardContent>
    </Card>
  );
}

// function Suggestions() {
//   return (
//     <Card className="shadow-sm border-gray-100">
//       <CardHeader>
//         <CardTitle className="text-base font-semibold text-gray-900">
//           Suggestions
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex gap-3 items-start">
//           <div className="mt-0.5 text-blue-500 shrink-0">
//             <Lightbulb className="h-4 w-4 fill-current" />
//           </div>
//           <p className="text-sm text-gray-600">
//             Consider making Question 4 optional to reduce drop-off
//           </p>
//         </div>
//         <div className="flex gap-3 items-start">
//           <div className="mt-0.5 text-gray-300 shrink-0">
//             <TrendingUp className="h-4 w-4" />
//           </div>
//           <p className="text-sm text-gray-600">
//             Simplify form-for mobile users to improve conversions
//           </p>
//         </div>

//         <Button variant="outline" className="w-full mt-4 border-gray-200">
//           Optimize Form
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

function RecentResponses() {
  const responses = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "Great",
      score: "9/10",
      time: "3 mins ago",
      platform: "Sterile",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      status: "Abandoned",
      score: "-",
      time: "12 mins ago",
      platform: "Sterile",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma@example.com",
      status: "Submitted",
      score: "8/10",
      time: "1 hour ago",
      platform: "Mobile",
    },
    {
      id: "4",
      name: "Mike Brown",
      email: "mike@example.com",
      status: "Completed",
      score: "10/10",
      time: "3 hours ago",
      platform: "Desktop",
    },
  ];

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            Recent Responses
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white text-gray-600 border-gray-200"
          >
            Segment <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white text-gray-600 border-gray-200"
          >
            <Download className="mr-1 h-3 w-3" /> Export{" "}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-gray-50 text-gray-900 border-gray-200 font-medium"
          >
            Last 30 Days
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="w-[50px] text-xs font-medium text-gray-500">
                ID
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Respondent
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Score
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Time
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 text-right">
                Last 30 Days
              </TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((resp) => (
              <TableRow
                key={resp.id}
                className="hover:bg-gray-50 border-gray-100"
              >
                <TableCell className="font-medium text-sm text-gray-600">
                  {resp.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resp.name}`}
                      />
                      <AvatarFallback>{resp.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {resp.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {resp.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      resp.status === "Great" || resp.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                        : resp.status === "Abandoned"
                          ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                          : "bg-blue-50 text-blue-700 ring-blue-700/10"
                    )}
                  >
                    {resp.status === "Great" && (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    )}
                    {resp.status}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 font-medium">
                  {resp.score}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {resp.time}
                </TableCell>
                <TableCell className="text-right text-xs text-gray-400">
                  {resp.platform}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
