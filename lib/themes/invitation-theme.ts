import { getThemeConfig } from "@/lib/themes/registry";

export type InvitationThemeField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  enabled?: boolean;
};

export type InvitationThemeSnapshot = {
  component_key: string;
  fields_schema?: unknown;
};

function normalizeFields(value: unknown): InvitationThemeField[] | null {
  if (!Array.isArray(value)) return null;

  const fields = value.filter((field): field is Record<string, unknown> => {
    if (!field || typeof field !== "object") return false;
    return typeof field.name === "string" && typeof field.label === "string" && typeof field.type === "string";
  });

  return fields.length === value.length ? fields.map((field) => ({
    name: field.name as string,
    label: field.label as string,
    type: field.type as string,
    ...(typeof field.placeholder === "string" ? { placeholder: field.placeholder } : {}),
    ...(Object.prototype.hasOwnProperty.call(field, "defaultValue") ? { defaultValue: field.defaultValue } : {}),
    ...(typeof field.required === "boolean" ? { required: field.required } : {}),
    ...(typeof field.enabled === "boolean" ? { enabled: field.enabled } : {}),
  })) : null;
}

export function resolveInvitationThemeFields(theme: InvitationThemeSnapshot | null | undefined): InvitationThemeField[] {
  const componentKey = theme?.component_key;
  if (!componentKey) return [];

  const snapshotFields = normalizeFields(theme.fields_schema);
  if (snapshotFields) return snapshotFields.filter((field) => field.enabled !== false);

  return getThemeConfig(componentKey).fields.map((field) => ({
    name: field.name,
    label: field.label,
    type: field.type,
    ...(field.placeholder ? { placeholder: field.placeholder } : {}),
    ...(Object.prototype.hasOwnProperty.call(field, "defaultValue") ? { defaultValue: field.defaultValue } : {}),
    enabled: true,
  }));
}

export function requiredInvitationThemeFields(theme: InvitationThemeSnapshot | null | undefined): InvitationThemeField[] {
  return resolveInvitationThemeFields(theme).filter((field) => field.required === true);
}
