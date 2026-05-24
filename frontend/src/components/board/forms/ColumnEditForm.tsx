import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type ColumnTitleFormValues = {
  title: string;
  position: number;
};

type ColumnEditFormProps = {
  columnId: number;
  initialTitle: string;
  initialPosition: number;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: ColumnTitleFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function ColumnEditForm({
  columnId,
  initialTitle,
  initialPosition,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: ColumnEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColumnTitleFormValues>({
    defaultValues: {
      title: initialTitle,
      position: initialPosition,
    },
  });

  useEffect(() => {
    reset({ title: initialTitle, position: initialPosition });
  }, [initialTitle, initialPosition, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-border bg-background p-3"
    >
      <div className="space-y-2">
        <Label htmlFor={`column-title-${columnId}`}>Column title</Label>
        <Input
          id={`column-title-${columnId}`}
          {...register("title", {
            required: "Column title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`column-position-${columnId}`}>Position</Label>
        <Input
          id={`column-position-${columnId}`}
          type="number"
          min={1}
          step={1}
          {...register("position", {
            required: "Position is required",
            valueAsNumber: true,
            min: { value: 1, message: "Position must be at least 1" },
          })}
        />
        {errors.position && (
          <p className="text-sm text-destructive">{errors.position.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save column"}
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
