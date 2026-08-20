"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createThemeVersionDraft, publishThemeVersion, setThemeActive, updateThemeAndDraft } from "@/services/themes/theme.service";
import { getThemeEditorData } from "@/services/themes/theme.query";

const uuidSchema = z.string().uuid();
const themeIdSchema = uuidSchema;
const versionIdSchema = uuidSchema;

export async function loadThemeEditor(themeId: string) {
  const parsed = themeIdSchema.safeParse(themeId);
  if (!parsed.success) throw new Error("Theme ID tidak valid");
  return getThemeEditorData(parsed.data);
}

export async function saveThemeDraft(input: {
  themeId: string;
  versionId?: string | null;
  componentKey: string;
  name: string;
  category: string;
  isPremium: boolean;
  thumbnailUrl: string | null;
  config: unknown;
  fieldsSchema: unknown;
  colors: unknown;
  assets: unknown;
}) {
  const themeId = themeIdSchema.parse(input.themeId);
  let versionId = input.versionId ? versionIdSchema.parse(input.versionId) : null;

  if (!versionId) {
    const draft = await createThemeVersionDraft({
      themeId,
      componentKey: input.componentKey,
      config: input.config,
      fieldsSchema: input.fieldsSchema,
      colors: input.colors,
      assets: input.assets,
    });
    versionId = z.object({ id: uuidSchema }).parse(draft).id;
  }

  const draft = await updateThemeAndDraft({
    themeId,
    versionId,
    name: input.name,
    category: input.category,
    isPremium: input.isPremium,
    thumbnailUrl: input.thumbnailUrl,
    config: input.config,
    fieldsSchema: input.fieldsSchema,
    colors: input.colors,
    assets: input.assets,
  });

  revalidatePath("/admin/themes");
  revalidatePath(`/admin/themes/preview/${input.componentKey}`);
  revalidatePath("/tema");
  return draft;
}

export async function publishThemeDraft(versionId: string) {
  const id = versionIdSchema.parse(versionId);
  const published = await publishThemeVersion(id);
  revalidatePath("/admin/themes");
  revalidatePath("/tema");
  return published;
}

export async function setThemeEnabled(themeId: string, isActive: boolean) {
  const id = themeIdSchema.parse(themeId);
  const theme = await setThemeActive(id, isActive);
  revalidatePath("/admin/themes");
  revalidatePath("/tema");
  revalidatePath(`/demo/${theme.slug}`);
  return theme;
}
