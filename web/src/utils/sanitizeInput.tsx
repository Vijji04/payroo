import DOMPurify from "dompurify";

export function sanitizeObject<T>(obj: T): T {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return (obj as unknown as unknown[]).map((v) =>
      sanitizeObject(v)
    ) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === "string") {
      result[key] = DOMPurify.sanitize(value);
    } else if (typeof value === "object") {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
