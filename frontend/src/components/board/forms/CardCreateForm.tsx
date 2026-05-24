import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type CardFormValues = {
  title: string;
  subtitle: string;
  metadata: string;
};

type CardCreateFormProps = {
  columnId: number;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: CardFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function CardCreateForm({
  columnId,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: CardCreateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      metadata: "{}",
    },
  });

  const handleCreate = async (values: CardFormValues) => {
    await onSubmit(values);
    reset({ title: "", subtitle: "", metadata: "{}" });
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreate)}
      className="space-y-3 rounded-xl border border-border bg-background p-3"
    >
      <div className="space-y-2">
        <Label htmlFor={`card-title-${columnId}`}>Card title</Label>
        <Input
          id={`card-title-${columnId}`}
          placeholder="Add a task title"
          {...register("title", {
            required: "Card title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`card-subtitle-${columnId}`}>Subtitle</Label>
        <Input
          id={`card-subtitle-${columnId}`}
          placeholder="Short context for the card"
          {...register("subtitle")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`card-metadata-${columnId}`}>Metadata JSON</Label>
        <textarea
          id={`card-metadata-${columnId}`}
          className="min-h-24 w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder='{"priority":"high"}'
          {...register("metadata", {
            validate: (value) => {
              if (!value.trim()) {
                return true;
              }

              try {
                JSON.parse(value);
                return true;
              } catch {
                return "Metadata must be valid JSON";
              }
            },
          })}
        />
        {errors.metadata && (
          <p className="text-sm text-destructive">{errors.metadata.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create card"}
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
