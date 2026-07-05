import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import type {
  MetadataField,
  MetadataFormValues,
} from "../utils/kanban/cardMetadataConversion";

type MetadataFieldArrayProps = {
  inputIdPrefix: string;
};

export function MetadataFieldArray({ inputIdPrefix }: MetadataFieldArrayProps) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<MetadataFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadataEntries",
  });

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>Metadata fields</Label>
        <p className="text-sm text-muted-foreground">
          Add data fields as needed.
        </p>
      </div>

      <div className="space-y-2">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            No fields yet.
          </div>
        ) : null}

        {fields.map((field, index) => {
          const keyError = errors.metadataEntries?.[index]?.key?.message;
          const keyId = `${inputIdPrefix}-metadata-key-${field.id}`;
          const valueId = `${inputIdPrefix}-metadata-value-${field.id}`;
          const keyPath = `metadataEntries.${index}.key` as const;
          const valuePath = `metadataEntries.${index}.value` as const;

          return (
            <div
              key={field.id}
              className="grid gap-2 rounded-lg border border-border bg-background p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <div className="space-y-1">
                <Label className="sr-only" htmlFor={keyId}>
                  Field name
                </Label>
                <Input
                  id={keyId}
                  placeholder="Salary"
                  {...register(keyPath, {
                    validate: (value) => {
                      const trimmedValue = value.trim();

                      if (!trimmedValue) {
                        return "Field name is required";
                      }

                      const metadataEntries = getValues("metadataEntries");
                      const hasDuplicate = metadataEntries.some(
                        (entry: MetadataField, entryIndex: number) =>
                          entryIndex !== index &&
                          entry.key.trim() === trimmedValue,
                      );

                      return hasDuplicate ? "Field names must be unique" : true;
                    },
                  })}
                />
                {keyError ? (
                  <p className="text-xs text-destructive">{keyError}</p>
                ) : null}
              </div>

              <div className="space-y-1">
                <Label className="sr-only" htmlFor={valueId}>
                  Field value
                </Label>
                <Input
                  id={valueId}
                  placeholder="$3000"
                  {...register(valuePath)}
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ key: "", value: "" })}
      >
        + Add Row
      </Button>
    </div>
  );
}
