import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { DialogClose } from "@/components/ui/dialog";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

type ConfirmDialogProps = {
  /** Element that opens the dialog */
  trigger: React.ReactNode;
  /** Dialog open state (controlled) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Content
  title?: string;
  description?: string;

  // Action button
  actionText?: string;
  actionVariant?: ButtonVariant;
  onAction: () => void;

  // Cancel button
  cancelText?: string;
};

export default function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  actionText = "Confirm",
  actionVariant = "destructive",
  onAction,
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={actionVariant}
              onClick={onAction}>
              {actionText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
