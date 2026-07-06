import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type BoardTitleFormValues = {
  title: string;
};

type BoardEditFormProps = {
  initialTitle: string;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: BoardTitleFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function BoardEditForm({
  initialTitle,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: BoardEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardTitleFormValues>({
    defaultValues: { title: initialTitle },
  });

  useEffect(() => {
    reset({ title: initialTitle });
  }, [initialTitle, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-border bg-background p-4"
    >
      <div className="space-y-2">
        <Label htmlFor="board-edit-title">Board title</Label>
        <Input
          id="board-edit-title"
          {...register("title", {
            required: "Board title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save board"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </form>
  );
}
