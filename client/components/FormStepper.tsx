import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export interface Step<T = unknown> {
  id: number;
  title: string;
  description: string;
  action?: {
    title: string;
    data: T;
  };
}

interface FormStepperProps<T = unknown> {
  steps: Step<T>[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  onAction?: (step: Step<T>) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  currentStep,
  orientation = "vertical",
  className,
  onAction,
}) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "upcoming";
  };

  if (orientation === "horizontal") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                        {
                          "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-200":
                            status === "active",
                          "border-teal-500 bg-teal-500 text-white":
                            status === "completed",
                          "border-gray-300 bg-white text-gray-400":
                            status === "upcoming",
                        }
                      )}>
                      {status === "completed" ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-all duration-300",
                        {
                          "bg-teal-500": status === "completed",
                          "bg-gray-300": status !== "completed",
                        }
                      )}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-4 flex flex-col gap-2">
                  <div>
                    <h3
                      className={cn(
                        "text-sm font-semibold transition-colors duration-300",
                        {
                          "text-gray-900":
                            status === "active" || status === "completed",
                          "text-gray-400": status === "upcoming",
                        }
                      )}>
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-xs transition-colors duration-300",
                        {
                          "text-gray-600":
                            status === "active" || status === "completed",
                          "text-gray-400": status === "upcoming",
                        }
                      )}>
                      {step.description}
                    </p>
                  </div>
                  {/* action */}
                  <div>
                    {step.action && currentStep === step.id && (
                      <Button
                        size={"sm"}
                        variant={
                          currentStep === step.id ? "default" : "outline"
                        }
                        disabled={currentStep !== step.id}
                        onClick={() => onAction?.(step)}>
                        {step.action?.title}
                        <ArrowRight />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Step Circle and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                    {
                      "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-200":
                        status === "active",
                      "border-teal-500 bg-teal-500 text-white":
                        status === "completed",
                      "border-gray-300 bg-white text-gray-400":
                        status === "upcoming",
                    }
                  )}>
                  {status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "mt-2 w-0.5 flex-1 transition-all duration-300",
                      {
                        "bg-teal-500": status === "completed",
                        "bg-gray-300": status !== "completed",
                      }
                    )}
                    style={{ minHeight: "48px" }}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex flex-col gap-5 pb-3">
                <div className="flex-1">
                  <h3
                    className={cn(
                      "text-base font-semibold transition-colors duration-300",
                      {
                        "text-gray-900":
                          status === "active" || status === "completed",
                        "text-gray-400": status === "upcoming",
                      }
                    )}>
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed transition-colors duration-300",
                      {
                        "text-gray-600":
                          status === "active" || status === "completed",
                        "text-gray-400": status === "upcoming",
                      }
                    )}>
                    {step.description}
                  </p>
                </div>
                <div>
                  {step.action && currentStep === step.id && (
                    <Button
                      size={"sm"}
                      variant={currentStep === step.id ? "default" : "outline"}
                      disabled={currentStep !== step.id}
                      onClick={() => onAction?.(step)}>
                      {step.action?.title}
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Default export for convenience
export default FormStepper;
