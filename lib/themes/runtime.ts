import { getThemeDefinition } from "@/lib/themes/definitions";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import type { RuntimeTheme, ThemeField, ThemeVersionSnapshot } from "@/types/theme";

function normalizeFields(input: unknown, fallback: ThemeField[], authoritative = false): ThemeField[] {
  if (!Array.isArray(input)) return fallback;
  if (input.length === 0 && !authoritative) return fallback;

  return input
    .filter((field): field is Record<string, unknown> => Boolean(field) && typeof field === "object")
    .map((field) => ({
      name: typeof field.name === "string" ? field.name : "",
      label: typeof field.label === "string" ? field.label : typeof field.name === "string" ? field.name : "Field",
      type: ["text", "textarea", "url", "boolean", "date", "image"].includes(String(field.type))
        ? (field.type as ThemeField["type"])
        : "text",
      placeholder: typeof field.placeholder === "string" ? field.placeholder : undefined,
      defaultValue: field.defaultValue,
    }))
    .filter((field) => field.name.length > 0);
}

export function resolveRuntimeTheme(
  theme: { slug: string; component_key?: string | null; colors?: unknown },
  version?: ThemeVersionSnapshot | null,
): RuntimeTheme {
  const componentKey = version?.component_key || theme.component_key || theme.slug;
  const definition = getThemeDefinition(componentKey);
  const authoritative = version?.fields_schema_authoritative === true;

  return {
    ...definition,
    componentKey,
    fields: normalizeFields(version?.fields_schema, definition.fields, authoritative),
    colors: normalizeThemeColors(version?.colors ?? theme.colors),
    versionId: version?.id ?? null,
    version: version?.version ?? null,
    config: version?.config ?? {},
    assets: version?.assets ?? {},
  };
}

export type { ThemeColors, RuntimeTheme, ThemeVersionSnapshot };
