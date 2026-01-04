import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { lazy, Suspense, useEffect, useRef } from "react";
import { NEW_FORM_ID } from "@/lib/constants";
import InlineEdit from "@/components/custom/InlineEdit";
import { useMultiPageFormBuilder } from "@/store/form-builder.store";
import { FormHealth } from "@/components/FormHealth";
import { Insights } from "@/components/FormInsights";
import { PerformanceTrendChart } from "@/components/FormPerformanceTrendChart";
import FormPlayground from "@/pages/FormPlayground";
const FormOverview = lazy(() => import("@/components/FormOverview"));
const FormResponses = lazy(() => import("@/components/FormResponses"));

const tabs = ["overview", "responses", "build", "share", "settings"];
const searchSchema = z.object({
  tab: z.enum(tabs).optional().default("overview").catch("overview"),
});

export const Route = createFileRoute("/_protected/forms/$formId/")({
  component: FormDashboard,
  validateSearch: (search) => searchSchema.parse(search),
});

function FormDashboard() {
  const { formId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = search.tab || "overview";

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    navigate({
      search: {
        tab: formId === NEW_FORM_ID ? "build" : tab,
      },
    });
  }, [formId]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) =>
        navigate({
          search: (prev: any) => ({
            ...prev,
            tab: value as
              | "overview"
              | "responses"
              | "build"
              | "share"
              | "settings",
          }),
        })
      }
      className="h-screen bg-gray-50/50 text-foreground flex flex-col font-sans"
    >
      {/* Top Navigation / Header */}
      <DashboardHeader formId={formId} />

      <main className="w-full h-[91%] flex-1 mx-auto space-y-6 ">
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* KPI / Stats Section */}
          <Suspense fallback={<div>form overview page Loading...</div>}>
            <FormOverview />
          </Suspense>

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
          <Suspense fallback={<div> form responses page Loading...</div>}>
            <FormResponses />
          </Suspense>
        </TabsContent>
        <TabsContent value="build" className="mt-0">
          <Suspense fallback={<div> form-builder page Loading...</div>}>
            <FormPlayground formRef={formRef} />
          </Suspense>
        </TabsContent>
        <TabsContent value="share" className="mt-0">
          share
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          settings
        </TabsContent>
      </main>
    </Tabs>
  );
}

function DashboardHeader({ formId }: { formId: string }) {
  const newForm = formId === NEW_FORM_ID;
  const title = useMultiPageFormBuilder((s) => s.title);
  const setTitle = useMultiPageFormBuilder((s) => s.setTitle);
  const isPublished = false; // TODO - fetch published status from form details
  return (
    <header className="h-[9%] sticky top-0 z-10 border-b bg-background px-6 py-3">
      <div className="flex items-center justify-between mx-auto w-full relative">
        <div className="flex items-center gap-4">
          {/* <Button
            variant="ghost"
            size="icon"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button> */}

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
                  {/* Form {formId.slice(0, 8)}... */}
                  <Tooltip>
                    <TooltipTrigger>
                      <Circle
                        className={cn(
                          "h-2 w-2 rounded-full font-mono tabular-nums",
                          {
                            "bg-gray-300 text-gray-300": !isPublished,
                            "bg-emerald-500 text-emerald-500": isPublished,
                          }
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {isPublished ? "Published" : "Draft"}
                    </TooltipContent>
                  </Tooltip>
                  <InlineEdit
                    className="max-w-50"
                    placeholder={title}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {/* <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Active
                  </span> */}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <TabsList className="bg-gray-100/50 border border-gray-200/50 h-9">
            <TabsTrigger
              value="overview"
              className="px-4 text-xs"
              disabled={newForm}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="px-4 text-xs"
              disabled={newForm}
            >
              Responses
            </TabsTrigger>
            <TabsTrigger value="build" className="px-4 text-xs">
              Build
            </TabsTrigger>
            <TabsTrigger
              value="share"
              className="px-4 text-xs"
              disabled={newForm}
            >
              Share
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="px-4 text-xs"
              disabled={newForm}
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 ">
          <Button
            variant="ghost"
            size="sm"
            disabled={newForm}
          >
            <Eye />
            {/* TODO - add logic to enable preview only if atleast one page and one element exists */}
            Preview
          </Button>

          {!newForm && (
            <Button
              size="sm"
              variant={"ghost"}
            >
              <Pencil />
              Edit
            </Button>
          )}
          {/* <div className="h-4 w-px bg-gray-200 mx-1" /> */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 text-gray-500 hover:text-gray-700"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 text-gray-500 hover:text-gray-700"
          >
            <Settings className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </header>
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
