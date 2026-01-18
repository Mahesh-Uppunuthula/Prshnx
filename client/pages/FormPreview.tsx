import FormInstance from "@/components/FormInstance";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toStructuredPages } from "@/lib/helper";
// import { useMultiPageFormBuilder } from "@/store/form-builder.store";
import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

type FormPreviewProps = {
  goBack: () => void;
};
export default function FormPreview({ goBack }: FormPreviewProps) {
  const title = useMultiPageFormStore((s) => s.title);
  const pageSettings = useMultiPageFormStore((s) => s.pageSettings);
  const pages = useMultiPageFormStore((s) => s.pages);
  const structuredConfiguration = useMemo(() => {
    const _config = toStructuredPages(title, pageSettings, pages);
    return _config
  }, [pages, pageSettings]);
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
        <FormInstance configuration={structuredConfiguration} devMode />
      </div>
    </div>
  );
}
