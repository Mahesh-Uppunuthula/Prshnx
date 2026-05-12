import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { copyToClipboard, toHumanReadableFormat } from "@/lib/helper";
import type { SelectForm } from "@server/db/schemas/forms.schema";
import {
  Circle,
  Copy,
  Edit,
  Ellipsis,
  Eye,
  History,
  MessageSquareReply,
  Trash,
} from "lucide-react";
import Show from "./utils/Show";
import { useDeleteForm } from "@/hooks/use-forms";
import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

type FormCardProps = {
  form: SelectForm;
};
type FormCardAction = "copy-link" | "preview" | "edit" | "delete";

export default function FormCard({ form }: FormCardProps) {
  const { mutate: deleteForm, isPending: deletingForm } = useDeleteForm();
  const navigate = useNavigate();
  const lastEdited = useMemo(() => {
    return toHumanReadableFormat(form.updatedAt, { addAgo: true });
  }, [form.updatedAt]);

  const openFormOverviewPage = useCallback(() => {
    navigate({ to: `/forms/${form.id}` });
  }, [form.id, navigate]);

  const handleFormCardAction = useCallback(
    (action: FormCardAction, formId: string) => (event: React.MouseEvent) => {
      event.stopPropagation();
      switch (action) {
        case "copy-link":
          copyToClipboard(form.publicLink!); // TODO add the correct route along with base url
          break;
        case "preview":
          // preview code
          break;
        case "edit":
          //  edit code
          break;
        case "delete":
          deleteForm(formId);
          break;
      }
    },
    [deleteForm],
  );
  return (
    <div
      key={form.id}
      className={cn(
        "group w-80 max-h-70 aspect-video rounded transition-all ring-1 ring-slate-200 cursor-pointer flex flex-col gap-1 p-2",
        "hover:shadow-xl",
      )}
      onClick={openFormOverviewPage}>
      {/* header */}
      <div className="h-full bg-slate-100 relative">
        {/* form preview */}
        <div
          className={cn(
            "absolute top-[60%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center place-items-center w-[70%] h-full scale-75",
          )}>
          <Show
            when={!!form.previewLink}
            fallback={
              <span className="text-muted-foreground">No Preview</span>
            }>
            <div className="w-full h-full overflow-hidden">
              <img
                src={form.previewLink!}
                className="w-full h-full object-left object-cover"
              />
            </div>
          </Show>
        </div>
        <Badge
          className={cn("absolute top-2 left-2 rounded ", {
            "bg-emerald-100 text-emerald-500": form.isPublished,
            "bg-muted-foreground/10 text-muted-foreground/50":
              !form.isPublished,
          })}>
          <Circle
            strokeWidth={1}
            className={cn({
              "text-emerald-500 fill-emerald-500 ": form.isPublished,
              "text-muted-foreground/50 fill-muted-foreground/50":
                !form.isPublished,
            })}
          />

          {form.isPublished ? "Live" : "Draft"}
        </Badge>
        {/* form actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              variant={"secondary"}
              className="absolute top-2 right-2 invisible group-hover:visible rounded text-muted-foreground">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuItem
              onClick={handleFormCardAction("copy-link", form.id)}>
              <Copy /> Copy link
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleFormCardAction("preview", form.id)}>
              <Eye /> Preview
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
                          <Copy /> Duplicate
                        </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleFormCardAction("edit", form.id)}>
              <Edit /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleFormCardAction("delete", form.id)}>
              {deletingForm ? <Spinner /> : <Trash />}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex place-items-center gap-2">
        <div className="text-sm text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap flex flex-col ">
          <span className="font-medium">{form.title}</span>
          <span className="text-xs">{form.description} </span>
        </div>
      </div>
      <div className="border-t my-1" />
      {/* footer */}
      <div className="w-full py-1 flex justify-between place-items-center gap-1">
        <Tooltip>
          <TooltipTrigger>
            <span className="flex place-items-center gap-2 text-muted-foreground p-1 hover:bg-secondary rounded">
              <MessageSquareReply size={16} strokeWidth={1} />
              <span className="text-sm">23</span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">23 responses</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-2 place-items-center text-sm text-muted-foreground p-1 hover:bg-secondary rounded">
              <History size={16} strokeWidth={1} />
              <span>{lastEdited}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Last edited {lastEdited}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
