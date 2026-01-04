import React, { useState } from "react";
import { FormStepper, Step } from "./FormStepper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const actionTypes = {
  build: "build",
  publish: "publish",
  share: "share",
};

const formSteps: Step[] = [
  {
    id: 1,
    title: "Build Form",
    description: "Build your form using our form builder.",
    action: {
      title: "Build",
      data: actionTypes.build,
    },
  },
  {
    id: 2,
    title: "Publish Form",
    description: "Publish your form to make it available for responses.",
    action: {
      title: "Publish",
      data: actionTypes.publish,
    },
  },
  {
    id: 3,
    title: "Share Form",
    description: "Share your form to start gathering responses.",
    action: {
      title: "Share",
      data: actionTypes.share,
    },
  },
];

type FormStepperDemoProps = {
  formId: string;
};

export const FormStepperDemo: React.FC<FormStepperDemoProps> = ({ formId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical"
  );
  // const search = useSearch({
  //   from: `/forms/${formId}`,
  // });
  const navigate = useNavigate();

  console.log({ formId });
  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  const handleAction = (step: Step) => {
    console.log({ step });
    switch (step.action?.data) {
      case actionTypes.build:
        navigate({
          to: `/forms/${formId}`,
          search: {
            tab: "build",
          },
        });
        handleNext();
        break;
      case actionTypes.publish:
        // TODO: publish form
        break;
      case actionTypes.share:
        navigate({
          to: `/forms/${formId}`,
          search: {
            tab: "share",
          },
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Get Started with Your New Form
          </h1>
          <p className="mt-2 text-gray-600">
            Follow these simple steps to create and share your form
          </p>
        </div>

        {/* Orientation Toggle */}
        {/* <div className="mb-8 flex justify-center gap-4">
          <Button
            variant={orientation === "vertical" ? "default" : "outline"}
            onClick={() => setOrientation("vertical")}>
            Vertical
          </Button>
          <Button
            variant={orientation === "horizontal" ? "default" : "outline"}
            onClick={() => setOrientation("horizontal")}>
            Horizontal
          </Button>
        </div> */}

        {/* Stepper Component */}
        <div className="w-full flex items-center justify-center bg-red-400 rounded p-3 bg-white shadow-xl">
          <FormStepper
            steps={formSteps}
            currentStep={currentStep}
            orientation={orientation}
            onAction={handleAction}
          />
        </div>

        {/* Controls */}
        {/* <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline">
            Previous
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === formSteps.length}>
            Next
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default FormStepperDemo;
