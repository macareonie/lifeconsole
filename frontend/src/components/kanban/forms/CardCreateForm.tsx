import { FormProvider, useForm } from "react-hook-form";

import { metadataEntriesToJson } from "../../../utils/kanban/cardHelpers.ts";
import { MetadataFieldArray } from "../../MetadataFieldArray";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import type { MetadataFormValues } from "../../../utils/kanban/cardHelpers.ts";

type CardFormValues = {
  title: string;
  subtitle: string;
} & MetadataFormValues;

type CardSubmissionValues = {
  title: string;
  subtitle: string;
  metadata: ReturnType<typeof metadataEntriesToJson>;
};

type CardCreateFormProps = {
  "aria-label": string;
  columnId: number;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: CardSubmissionValues) => Promise<void> | void;
  onCancel: () => void;
};

export function CardCreateForm({
  "aria-label": ariaLabel,
  columnId,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: CardCreateFormProps) {
  const methods = useForm<CardFormValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      metadataEntries: [],
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const handleCreate = async (values: CardFormValues) => {
    await onSubmit({
      title: values.title,
      subtitle: values.subtitle,
      metadata: metadataEntriesToJson(values.metadataEntries),
    });
    reset({ title: "", subtitle: "", metadataEntries: [] });
  };

  return (
    <FormProvider {...methods}>
      <form
        aria-label={ariaLabel}
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

        <MetadataFieldArray inputIdPrefix={`card-${columnId}`} />

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
    </FormProvider>
  );
}
