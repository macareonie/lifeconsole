import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type CardFormValues = {
  title: string;
  subtitle: string;
  metadata: string;
};

type CardEditFormProps = {
  cardId: number;
  initialTitle: string;
  initialSubtitle: string;
  initialMetadata: string;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: CardFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function CardEditForm({
  cardId,
  initialTitle,
  initialSubtitle,
  initialMetadata,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: CardEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues>({
    defaultValues: {
      title: initialTitle,
      subtitle: initialSubtitle,
      metadata: initialMetadata,
    },
  });

  useEffect(() => {
    reset({
      title: initialTitle,
      subtitle: initialSubtitle,
      metadata: initialMetadata,
    });
  }, [initialTitle, initialSubtitle, initialMetadata, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`card-title-${cardId}`}>Title</Label>
        <Input
          id={`card-title-${cardId}`}
          {...register("title", {
            required: "Card title is required",
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`card-subtitle-${cardId}`}>Subtitle</Label>
        <Input id={`card-subtitle-${cardId}`} {...register("subtitle")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`card-metadata-${cardId}`}>Metadata JSON</Label>
        <textarea
          id={`card-metadata-${cardId}`}
          className="min-h-36 w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save card"}
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
