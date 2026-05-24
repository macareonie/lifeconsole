import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type ColumnFormValues = {
  title: string;
};

type ColumnCreateFormProps = {
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: ColumnFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function ColumnCreateForm({
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: ColumnCreateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColumnFormValues>({
    defaultValues: { title: "" },
  });

  const handleCreate = async (values: ColumnFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreate)}
      className="space-y-3 rounded-xl border border-border bg-background p-4"
    >
      <div className="space-y-2">
        <Label htmlFor="column-title">Column title</Label>
        <Input
          id="column-title"
          placeholder="To do, Doing, Done"
          {...register("title", {
            required: "Column title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create column"}
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
