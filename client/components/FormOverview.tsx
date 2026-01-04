import { Activity, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export default function FormOverview() {
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
            )}>
            {percentageChange.toFixed(1)}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn(
              "font-medium",
              currentWeekDelta > 0 ? "text-emerald-600" : "text-rose-600",
              currentWeekDelta === 0 && "text-gray-400"
            )}>
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
            )}>
            {percentageChange.toFixed(1)}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn(
              "font-medium",
              currentWeekDelta > 0 ? "text-emerald-600" : "text-rose-600",
              currentWeekDelta === 0 && "text-gray-400"
            )}>
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
            })}>
            {completionRateChangePercentage}%{" "}
            <span className="text-gray-400 font-normal">from last week</span>
          </span>
          <span
            className={cn("font-medium", {
              "text-emerald-500": isPositiveChange,
              "text-rose-500 ": !isPositiveChange,
            })}>
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
export function DropOffPointCard({ dropOffPoints }: DropOffPointCardProps) {
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
    const r = dropOffPoints[q]?.reached || 0;
    const e = dropOffPoints[q]?.exited || 0;
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
        questionIndex = dropOffPoints[q]?.questionIndex || -1;
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
            )}>
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
            )}>
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
