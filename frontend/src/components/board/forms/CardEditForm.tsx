import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  metadataEntriesToJson,
  metadataJsonToEntries,
} from "../../../utils/kanban/CardMetadataConversion";
import { MetadataFieldArray } from "../../MetadataFieldArray";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import type { MetadataFormValues } from "../../../utils/kanban/CardMetadataConversion";
import type { JsonValue } from "../../../types/json";

type CardFormValues = {
  title: string;
  subtitle: string;
} & MetadataFormValues;

export type CardSubmissionValues = {
  title: string;
  subtitle: string;
  metadata: JsonValue;
};

type CardEditFormProps = {
  card_id: number;
  initialTitle: string;
  initialSubtitle: string;
  initialMetadata: JsonValue;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (values: CardSubmissionValues) => Promise<void> | void;
  onCancel: () => void;
};

export function CardEditForm({
  card_id,
  initialTitle,
  initialSubtitle,
  initialMetadata,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: CardEditFormProps) {
  const methods = useForm<CardFormValues>({
    defaultValues: {
      title: initialTitle,
      subtitle: initialSubtitle,
      metadataEntries: metadataJsonToEntries(initialMetadata),
    },
  });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset({
      title: initialTitle,
      subtitle: initialSubtitle,
      metadataEntries: metadataJsonToEntries(initialMetadata),
    });
  }, [initialTitle, initialSubtitle, initialMetadata, reset]);

  const handleSave = async (values: CardFormValues) => {
    await onSubmit({
      title: values.title,
      subtitle: values.subtitle,
      metadata: metadataEntriesToJson(values.metadataEntries),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`card-title-${card_id}`}>Title</Label>
          <Input
            id={`card-title-${card_id}`}
            {...register("title", {
              required: "Card title is required",
            })}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`card-subtitle-${card_id}`}>Subtitle</Label>
          <Input id={`card-subtitle-${card_id}`} {...register("subtitle")} />
        </div>

        <MetadataFieldArray inputIdPrefix={`card-${card_id}`} />

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
    </FormProvider>
  );
}
