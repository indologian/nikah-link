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

export interface ThemeInvitationData {
  id?: string | null;
  username?: string | null;
  bride_name?: string | null;
  groom_name?: string | null;
  bride_photo_url?: string | null;
  groom_photo_url?: string | null;
  love_story?: string | null;
  akad_date?: string | null;
  akad_time?: string | null;
  akad_venue?: string | null;
  akad_address?: string | null;
  akad_maps_url?: string | null;
  reception_date?: string | null;
  reception_time?: string | null;
  reception_venue?: string | null;
  reception_address?: string | null;
  reception_maps_url?: string | null;
  music_url?: string | null;
  cover_image_url?: string | null;
  custom_message?: string | null;
  theme_colors?: ThemeColors | Record<string, unknown> | null;
  theme_version?: ThemeVersionSnapshot | null;
  [key: string]: unknown;
}

export interface ThemeComponentProps {
  invitation: ThemeInvitationData;
  guestName?: string;
  initialWishes?: unknown[];
  giftAccounts?: unknown[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: Record<string, unknown>;
  themeConfig?: unknown;
  themeAssets?: unknown;
  themeVersion?: ThemeVersionSnapshot | null;
  [key: string]: unknown;
}

export interface RuntimeTheme extends ThemeDefinition {
  componentKey: string;
  colors: ThemeColors;
  versionId: string | null;
  version: number | null;
  config: unknown;
  assets: unknown;
}
