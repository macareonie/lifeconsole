export function snakeToCamel<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      snakeToCamel(value),
    ]),
  );
}

export function camelToSnake<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(),
      camelToSnake(value),
    ]),
  );
}
