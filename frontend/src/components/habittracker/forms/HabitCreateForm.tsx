import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

type HabitFormValues = {
  title: string;
  frequency: string;
};

export function HabitCreateForm({
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: {
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: HabitFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    defaultValues: { title: "" },
  });

  const handleCreate = async (values: HabitFormValues) => {
    await onSubmit(values);
    reset({ title: "" });
  };

  return (
    <form
      aria-label="Create habit"
      onSubmit={handleSubmit(handleCreate)}
      className="space-y-3 rounded-xl border border-border bg-background p-3"
    >
      <div className="space-y-2">
        <Label htmlFor="habit-title">Habit title</Label>
        <Input
          id="habit-title"
          placeholder="e.g. Drink water"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create habit"}
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
