export type ThemeFieldType = "text" | "textarea" | "url" | "boolean" | "date" | "image";

export interface ThemeField {
  name: string;
  label: string;
  type: ThemeFieldType;
  placeholder?: string;
  defaultValue?: unknown;
}

export interface ThemeDefinition {
  slug: string;
  fields: ThemeField[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeVersionSnapshot {
  id?: string | null;
  theme_id?: string | null;
  version?: number | null;
  component_key?: string | null;
  config?: unknown;
  fields_schema?: unknown;
  colors?: unknown;
  assets?: unknown;
  fields_schema_authoritative?: boolean | null;
  is_published?: boolean | null;
  lifecycle_status?: string | null;
}

export interface RuntimeTheme extends ThemeDefinition {
  componentKey: string;
  colors: ThemeColors;
  versionId: string | null;
  version: number | null;
  config: unknown;
  assets: unknown;
}
