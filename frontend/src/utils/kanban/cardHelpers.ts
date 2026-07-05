import type { JsonValue } from "../../types/json";

export type MetadataField = {
  key: string;
  value: string;
};

export type MetadataFormValues = {
  metadataEntries: MetadataField[];
};
const parseMetadataValue = (value: string): JsonValue => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  try {
    return JSON.parse(trimmedValue) as JsonValue;
  } catch {
    return value;
  }
};

export const metadataEntriesToJson = (entries: MetadataField[]): JsonValue => {
  return entries.reduce<Record<string, JsonValue>>((metadata, entry) => {
    const key = entry.key.trim();

    if (!key) {
      return metadata;
    }

    metadata[key] = parseMetadataValue(entry.value);
    return metadata;
  }, {});
};

export const metadataJsonToEntries = (metadata: JsonValue): MetadataField[] => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [];
  }

  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value, null, 2),
  }));
};
