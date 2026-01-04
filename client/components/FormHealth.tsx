import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function FormHealth() {
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
