import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormInstance from "./FormInstance";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useBuilderStore } from "@/hooks/use-builder-store";

type FormPreviewProps = {
  goBack: () => void;
};
function FormPreview({ goBack }: FormPreviewProps) {
  const pages = useBuilderStore((s) => s.pages);
  const pagesOrder = useBuilderStore((s) => s.pagesOrder);
  console.log({ pages });

  console.log({ pagesOrder });
  return (
    <div className="w-full h-screen p-1">
      {/* nav bar */}
      <div className="w-full h-[5%]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"sm"} onClick={goBack}>
              <ArrowLeft />
              <span>Back to editor</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            click to go back to editor
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full h-[95%]">
        <FormInstance devMode pages={pages} pagesOrder={pagesOrder} />
      </div>
    </div>
  );
}

export default FormPreview;
