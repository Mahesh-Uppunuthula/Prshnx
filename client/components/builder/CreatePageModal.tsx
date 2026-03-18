import { Page } from "@/types/builder.types";
import { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LuPlus } from "react-icons/lu";
import { Input } from "../ui/input";

type CreatePageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pageLabel: Page["label"]) => void;
};
export default function CreatePageModal({
  open,
  onOpenChange,
  onSubmit,
}: CreatePageModalProps) {
  const pageLabelRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <LuPlus /> Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Enter the name of the new page.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(pageLabelRef.current?.value ?? "New Page");
          }}>
          <Input ref={pageLabelRef} placeholder="Example: Contact Page" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Page</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
