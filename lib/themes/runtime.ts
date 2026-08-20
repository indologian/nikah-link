import type { ThemeConfig, ThemeField } from "@/lib/themes/registry";
import { getThemeConfig } from "@/lib/themes/registry";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";

export type ThemeVersionSnapshot = {
  id?: string | null;
  theme_id?: string | null;
  version?: number | null;
  component_key?: string | null;
  config?: unknown;
  fields_schema?: unknown;
  colors?: unknown;
  assets?: unknown;
  fields_schema_authoritative?: boolean | null;
};

export type RuntimeTheme = ThemeConfig & {
  componentKey: string;
  colors: ThemeColors;
  versionId: string | null;
  version: number | null;
  config: unknown;
  assets: unknown;
};

function normalizeFields(input: unknown, fallback: ThemeField[], authoritative = false): ThemeField[] {
  if (!Array.isArray(input)) return fallback;
  if (input.length === 0 && !authoritative) return fallback;

  const fields = input.filter(
    (field): field is Record<string, unknown> => Boolean(field) && typeof field === "object"
  );

  return fields
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
  version?: ThemeVersionSnapshot | null
): RuntimeTheme {
  const componentKey = version?.component_key || theme.component_key || theme.slug;
  const config = getThemeConfig(componentKey);
  const authoritative = version?.fields_schema_authoritative === true;

  return {
    ...config,
    componentKey,
    fields: normalizeFields(version?.fields_schema, config.fields, authoritative),
    colors: normalizeThemeColors(version?.colors ?? theme.colors),
    versionId: version?.id ?? null,
    version: version?.version ?? null,
    config: version?.config ?? {},
    assets: version?.assets ?? {},
  };
}
