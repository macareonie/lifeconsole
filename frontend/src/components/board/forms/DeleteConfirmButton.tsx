import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

type DeleteConfirmButtonProps = {
  confirmMessage: string;
  label: string;
  pendingLabel: string;
  isPending: boolean;
  onConfirm: () => Promise<void> | void;
  size?: "xs" | "sm";
};

export function DeleteConfirmButton({
  confirmMessage,
  label,
  pendingLabel,
  isPending,
  onConfirm,
  size = "sm",
}: DeleteConfirmButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isPending) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button variant="destructive" size={size} disabled={isPending}>
          {isPending ? pendingLabel : label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <DialogDescription>{confirmMessage}</DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? pendingLabel : label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
