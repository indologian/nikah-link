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
  fields_schema_authoritative?: boolean | null;
  colors?: unknown;
  assets?: unknown;
};

export type RuntimeTheme = ThemeConfig & {
  componentKey: string;
  colors: ThemeColors;
  versionId: string | null;
  version: number | null;
  config: unknown;
  assets: unknown;
  fieldsSchemaAuthoritative: boolean;
};

const SUPPORTED_FIELD_TYPES: ThemeField["type"][] = [
  "text",
  "textarea",
  "url",
  "boolean",
  "date",
  "image",
];

function normalizeFields(input: unknown, fallback: ThemeField[], authoritative: boolean): ThemeField[] {
  if (!authoritative) return fallback;
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (field): field is Record<string, unknown> => Boolean(field) && typeof field === "object"
    )
    .map((field) => ({
      name: typeof field.name === "string" ? field.name.trim() : "",
      label:
        typeof field.label === "string" && field.label.trim().length > 0
          ? field.label.trim()
          : typeof field.name === "string"
            ? field.name.trim()
            : "Field",
      type: SUPPORTED_FIELD_TYPES.includes(String(field.type) as ThemeField["type"])
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
  const fieldsSchemaAuthoritative = version?.fields_schema_authoritative === true;

  return {
    ...config,
    componentKey,
    fields: normalizeFields(version?.fields_schema, config.fields, fieldsSchemaAuthoritative),
    colors: normalizeThemeColors(version?.colors ?? theme.colors),
    versionId: version?.id ?? null,
    version: version?.version ?? null,
    config: version?.config ?? {},
    assets: version?.assets ?? {},
    fieldsSchemaAuthoritative,
  };
}
