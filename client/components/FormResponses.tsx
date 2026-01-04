import { ChevronDown, CheckCircle2, Download, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
export default function RecentResponses() {
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
            className="h-8 text-xs bg-white text-gray-600 border-gray-200">
            Segment <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white text-gray-600 border-gray-200">
            <Download className="mr-1 h-3 w-3" /> Export{" "}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-gray-50 text-gray-900 border-gray-200 font-medium">
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
                className="hover:bg-gray-50 border-gray-100">
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
                    )}>
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
                    className="h-8 w-8 text-gray-400">
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
