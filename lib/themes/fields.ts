import type { ThemeField } from "@/lib/themes/registry";

export type ThemeFieldSchema = ThemeField & {
  required?: boolean;
  enabled?: boolean;
};

const FIELD_TYPES = new Set<ThemeField["type"]>([
  "text",
  "textarea",
  "url",
  "boolean",
  "date",
  "image",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidField(value: unknown): value is ThemeFieldSchema {
  if (!isRecord(value)) return false;
  if (typeof value.name !== "string" || !value.name.trim()) return false;
  if (typeof value.label !== "string" || !value.label.trim()) return false;
  if (typeof value.type !== "string" || !FIELD_TYPES.has(value.type as ThemeField["type"])) {
    return false;
  }
  if (value.placeholder !== undefined && typeof value.placeholder !== "string") return false;
  if (value.required !== undefined && typeof value.required !== "boolean") return false;
  if (value.enabled !== undefined && typeof value.enabled !== "boolean") return false;
  return true;
}

/**
 * Resolve a version snapshot against the renderer's canonical field contract.
 * Invalid snapshot entries are ignored. Unknown fields are allowed so future
 * renderers can consume new keys, while known renderer fields remain stable.
 */
export function resolveThemeFields(
  snapshot: unknown,
  rendererFields: ThemeField[]
): ThemeFieldSchema[] {
  if (!Array.isArray(snapshot) || snapshot.length === 0) {
    return rendererFields;
  }

  const validSnapshot = snapshot.filter(isValidField);
  if (validSnapshot.length === 0) return rendererFields;

  const rendererNames = new Set(rendererFields.map((field) => field.name));
  const rendererMap = new Map(rendererFields.map((field) => [field.name, field]));
  const result: ThemeFieldSchema[] = [];

  for (const field of validSnapshot) {
    const base = rendererMap.get(field.name);

    if (base) {
      result.push({
        ...base,
        ...field,
        type: base.type,
      });
    } else {
      result.push(field);
    }
  }

  // Preserve renderer defaults that are not present in an older snapshot.
  for (const field of rendererFields) {
    if (!validSnapshot.some((snapshotField) => snapshotField.name === field.name)) {
      result.push(field);
    }
  }

  return result.filter((field) => field.enabled !== false || !rendererNames.has(field.name));
}

export function serializeThemeFields(fields: ThemeFieldSchema[]): ThemeFieldSchema[] {
  return fields.map((field) => ({
    name: field.name,
    label: field.label,
    type: field.type,
    ...(field.placeholder ? { placeholder: field.placeholder } : {}),
    ...(field.defaultValue !== undefined ? { defaultValue: field.defaultValue } : {}),
    ...(field.required !== undefined ? { required: field.required } : {}),
    ...(field.enabled !== undefined ? { enabled: field.enabled } : {}),
  }));
}
