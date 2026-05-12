import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { cn, createFirstPageScreenShot } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { LuEye, LuCircle, LuSave } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NEW_FORM_ID } from "@/lib/constants";
import InlineEdit from "@/components/custom/InlineEdit";
// import { useMultiPageFormStore } from "@/store/form-builder.store";
import {
  MultiPageFormProvider,
  useMultiPageFormStore,
} from "@/context/MultiPageFormProvider";
import { FormHealth } from "@/components/FormHealth";
import { Insights } from "@/components/FormInsights";
import { PerformanceTrendChart } from "@/components/FormPerformanceTrendChart";
// import FormPlayground from "@/pages/FormPlayground";
import {
  isBuilderEmpty,
  // isFormEmpty,
  toStructuredPages,
} from "@/lib/helper";
import {
  useFormConfigurationById,
  useSaveForm,
  useUpdateForm,
} from "@/hooks/use-forms";
import { toast } from "sonner";
// import { MultiPageFormProvider } from "@/context/MultiPageFormProvider";
import { FormConfiguration } from "@/types/form.types";
import Show from "@/components/utils/Show";
import FormPreview from "@/pages/LegacyFormPreview";
import Builder from "@/pages/builder";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { BuilderProvider } from "@/context/BuilderProvider";
import { InitialBuilderState } from "@/store/builder.store";
const FormOverview = lazy(() => import("@/components/FormOverview"));
const FormResponses = lazy(() => import("@/components/FormResponses"));

const tabs = ["overview", "responses", "build", "share", "settings"];
const searchSchema = z.object({
  tab: z.enum(tabs).optional().default("overview").catch("overview"),
});

type DispatchAction =
  | { type: "saveForm" }
  | { type: "previewForm" }
  | { type: "updateForm" };

export const Route = createFileRoute("/_protected/forms/$formId/")({
  component: FormDashboard,
  validateSearch: (search) => searchSchema.parse(search),
});

function FormDashboard() {
  // router states
  const { formId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // queries
  const { data: formConfig, isLoading } = useFormConfigurationById(formId);

  const initialBuilderState: InitialBuilderState | undefined = useMemo(() => {
    if (!formConfig) {
      console.log("multipageformprovider", "formConfig not found");
      return undefined;
    }
    console.log("multipageformprovider", { formConfig });
    const res: InitialBuilderState = {
      title: formConfig.title,
      version: formConfig.version ?? 1,
      pages: formConfig.pages,
      pagesOrder: formConfig.pagesOrder,
      active: {
        node: null,
        page: null,
      },
    };

    console.log("multipageformprovider", { res });
    return res;
  }, [formConfig]);

  useEffect(() => {
    navigate({
      search: {
        tab: formId === NEW_FORM_ID ? "build" : search.tab || "overview",
      },
    });
  }, [formId]);

  // For existing forms, wait until data is loaded before rendering provider
  // This prevents the provider from being created with empty data and then recreated
  const isExistingForm = formId !== NEW_FORM_ID;
  if (isExistingForm && isLoading) {
    return <div>Loading form configuration...</div>;
  }

  return (
    <BuilderProvider initialBuilderState={initialBuilderState}>
      <MultiPageFormProvider initialForm={undefined}>
        <FormDashboardContent formId={formId} isLoading={isLoading} />
      </MultiPageFormProvider>
    </BuilderProvider>
  );
}

type FormDashboardContentProps = {
  formId: string;
  isLoading: boolean;
};

function FormDashboardContent({
  formId,
  isLoading,
}: FormDashboardContentProps) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // refs
  const formRef = useRef<HTMLDivElement>(null);

  // mutations
  const { mutate: saveForm, isPending: isSavingForm } = useSaveForm();
  const { mutate: updateForm, isPending: isUpdatingForm } = useUpdateForm();

  // states
  const [preview, setPreview] = useState(false);

  // store states
  const formTitle = useBuilderStore((s) => s.title);
  const pages = useBuilderStore((s) => s.pages);
  const pagesOrder = useBuilderStore((s) => s.pagesOrder);
  const version = useBuilderStore((s) => s.version);
  const pageSettings = useMultiPageFormStore((s) => s.pageSettings);
  const isDirty = useMultiPageFormStore((s) => s.isDirty);
  const markSaved = useMultiPageFormStore((s) => s.markSaved);

  const setActivePageId = useMultiPageFormStore((s) => s.setActivePageId);
  const setActiveFormElement = useMultiPageFormStore(
    (s) => s.setActiveFormElement,
  );

  // computed states
  const tab = search.tab || "overview";
  // const firstPageId = pages.keys().next().value!;
  // const firstPageHasElements = pages.get(firstPageId)!.body.elements.length > 0;

  // callbacks
  const dispatch = useCallback(
    async (action: DispatchAction) => {
      switch (action.type) {
        case "saveForm":
          {
            console.log("dispatch", "saveForm", formRef, formRef.current);
            // if (!formRef || !formRef.current) return;

            // // set first page for preview
            // setActivePageId(pages.keys().next().value!);
            // setActiveFormElement("dummy-id", "cta");

            // create the form preview screenshot
            // const formPreviewResponse = firstPageHasElements
            //   ? await createFirstPageScreenShot(formRef)
            //   : null;

            // const formData = new FormData();
            // formData.append(
            //   "form",
            //   JSON.stringify(toStructuredPages(formTitle, pageSettings, pages)),
            // );
            // if (formPreviewResponse && formPreviewResponse.success)
            //   formData.append(
            //     "preview",
            //     formPreviewResponse.data,
            //     `${formTitle}_preview.png`,
            //   );

            saveForm(
              {
                title: formTitle,
                description: "",
                settings: pageSettings,
                version: version,
                configuration: {
                  pages: pages,
                  pagesOrder: pagesOrder,
                },
              },
              {
                onSuccess: (data) => {
                  // markSaved(); TODO - add this to new builder store
                  toast.success("Form saved successfully", {
                    closeButton: true,
                  });
                  navigate({
                    to: `/forms/${data.insertionId}`,
                    search: {
                      tab: "overview",
                    },
                  });
                },
                onError: (error) => {
                  toast.error(error.message);
                },
              },
            );
          }
          break;
        // case "updateForm":
        //   {
        //     console.log("dispatch", "updateForm", formRef, formRef.current);
        //     if (!formRef || !formRef.current) return;

        //     // set first page for preview
        //     setActivePageId(pages.keys().next().value!);
        //     setActiveFormElement("dummy-id", "cta");

        //     // create the form preview screenshot
        //     const formPreviewResponse = firstPageHasElements
        //       ? await createFirstPageScreenShot(formRef)
        //       : null;

        //     const formData = new FormData();
        //     formData.append(
        //       "form",
        //       JSON.stringify(toStructuredPages(formTitle, pageSettings, pages)),
        //     );
        //     if (formPreviewResponse && formPreviewResponse.success)
        //       formData.append(
        //         "preview",
        //         formPreviewResponse.data,
        //         `${formTitle}_preview.png`,
        //       );
        //     updateForm(
        //       { formId, form: formData },
        //       {
        //         onSuccess: () => {
        //           markSaved();
        //           toast.success("Form updated successfully", {
        //             closeButton: true,
        //           });
        //           navigate({
        //             to: `/forms/${formId}`,
        //             search: {
        //               tab: "overview",
        //             },
        //           });
        //         },
        //         onError: (error) => {
        //           toast.error(error.message);
        //         },
        //       },
        //     );
        //   }
        //   break;
        // case "previewForm":
        //   setPreview(true);
        //   break;
      }
    },
    [
      formTitle,
      pageSettings,
      pages,
      // firstPageHasElements,
      setActivePageId,
      setActiveFormElement,
      saveForm,
      navigate,
    ],
  );
  const handlePreviewExit = useCallback(() => {
    setPreview(false);
  }, []);

  return (
    <Show when={!preview} fallback={<FormPreview goBack={handlePreviewExit} />}>
      <Tabs
        value={tab}
        onValueChange={(value) => {
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
          });
        }}
        className="h-screen gap-0 bg-gray-50/50 text-foreground flex flex-col font-sans">
        {/* Top Navigation / Header */}
        <DashboardHeader
          formId={formId}
          dispatch={dispatch}
          state={{
            isSyncing: isSavingForm || isUpdatingForm,
            isSyncDisabled: isSavingForm || isUpdatingForm || !isDirty,
          }}
        />

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
          <TabsContent value="build" className="m-0 h-full">
            <Suspense fallback={<div> form-builder page Loading...</div>}>
              {isLoading ? (
                <div>playground loading...</div>
              ) : (
                // <FormPlayground formRef={formRef} />
                <Builder />
              )}
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
    </Show>
  );
}

type DashboardHeaderProps = {
  formId: string;
  dispatch: (action: DispatchAction) => void;
  state: {
    isSyncing: boolean;
    isSyncDisabled: boolean;
  };
};
function DashboardHeader({ formId, dispatch, state }: DashboardHeaderProps) {
  const newForm = formId === NEW_FORM_ID;
  const title = useBuilderStore((s) => s.title);
  const setTitle = useBuilderStore((s) => s.setTitle);
  const pages = useBuilderStore((s) => s.pages);
  const isEmptyForm = useMemo(() => isBuilderEmpty(pages), [pages]);

  // isSyncDisabled from the parent is based on the old store's isDirty (which is
  // never updated by the new BuilderStore). Override it: only block while a
  // mutation is in flight; show/enable the button based on builder content.
  const isSyncDisabled = state.isSyncing;

  const { data: formConfig } = useFormConfigurationById(formId);
  const isPublished = !!formConfig?.isPublished;
  // const a = useMultiPageFormStore((s) => s.isPublished);
  return (
    <header className="h-[9%] flex justify-center place-items-center sticky top-0 z-10 border-b bg-background px-6 py-3">
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
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  Forms
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground flex items-center gap-2">
                  {/* Form {formId.slice(0, 8)}... */}
                  <Tooltip>
                    <TooltipTrigger>
                      <LuCircle
                        className={cn(
                          "h-2 w-2 rounded-full font-mono tabular-nums",
                          {
                            "bg-gray-300 text-gray-300": !isPublished,
                            "bg-emerald-500 text-emerald-500": isPublished,
                          },
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
              disabled={newForm}>
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="px-4 text-xs"
              disabled={newForm}>
              Responses
            </TabsTrigger>
            <TabsTrigger value="build" className="px-4 text-xs">
              Build
            </TabsTrigger>
            <TabsTrigger
              value="share"
              className="px-4 text-xs"
              disabled={newForm}>
              Share
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="px-4 text-xs"
              disabled={newForm}>
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 ">
          <Button
            variant="ghost"
            size="sm"
            disabled={isEmptyForm}
            onClick={() => dispatch({ type: "previewForm" })}>
            <LuEye />
            {/* TODO - add logic to enable preview only if atleast one page and one element exists */}
            Preview
          </Button>
          {!isEmptyForm && (
            <Button
              size="sm"
              onClick={() =>
                dispatch({
                  type: newForm ? "saveForm" : "updateForm",
                })
              }
              variant={isSyncDisabled ? "outline" : "default"}
              disabled={isSyncDisabled}>
              <LuSave />
              {state.isSyncing ? "Saving..." : "Save"}
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
