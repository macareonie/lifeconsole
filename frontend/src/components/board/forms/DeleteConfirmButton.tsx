import { Button } from "../../ui/button";

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
  const handleClick = async () => {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) {
      return;
    }
    await onConfirm();
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size={size}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? pendingLabel : label}
    </Button>
  );
}
