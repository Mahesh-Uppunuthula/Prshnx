import FormInstance from "@/components/FormInstance";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft } from "lucide-react";

type FormPreviewProps = {
  goBack: () => void;
};
export default function FormPreview({ goBack }: FormPreviewProps) {
  return (
    <div className="w-full h-screen p-1">
      {/* nav bar */}
      <div className="w-full h-[5%]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"sm"} onClick={goBack}>
              <ArrowLeft />
              <span>Exit Preview</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">exit preview</TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full h-[95%]">
        <FormInstance />
      </div>
    </div>
  );
}
