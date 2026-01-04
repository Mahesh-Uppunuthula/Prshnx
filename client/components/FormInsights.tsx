import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
export function Insights() {
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
