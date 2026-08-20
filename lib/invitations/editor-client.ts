"use client";

import {
  checkInvitationUsername,
  createInvitationAction,
  loadActiveInvitationThemes,
  loadInvitationEditor,
  loadNewInvitationContext,
  updateInvitationAction,
  uploadInvitationAssetAction,
} from "@/actions/invitations/invitation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function publicStorageUrl(bucket: string, path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

class QueryChain<T = any> {
  private operation: () => Promise<any>;

  constructor(operation: () => Promise<any>) {
    this.operation = operation;
  }

  eq(_column: string, _value: unknown) {
    return this;
  }

  order(_column: string, _options?: unknown) {
    return this;
  }

  select(_selection?: unknown, _options?: unknown) {
    return this;
  }

  single() {
    return this;
  }

  maybeSingle() {
    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.operation().then(onfulfilled as any, onrejected as any);
  }

  catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null) {
    return this.operation().catch(onrejected as any);
  }
}

function notSupported(table: string, operation: string): never {
  throw new Error(`Unsupported invitation editor backend operation: ${operation} on ${table}`);
}

export function createInvitationEditorBackend() {
  return {
    auth: {
      async getUser() {
        const context = await loadNewInvitationContext();
        return { data: { user: context ? { id: context.userId } : null }, error: null };
      },
    },

    from(table: string) {
      if (table === "themes") {
        return {
          select: () => new QueryChain(() => loadActiveInvitationThemes().then((data) => ({ data, error: null }))),
          insert: () => notSupported(table, "insert"),
          update: () => notSupported(table, "update"),
          delete: () => notSupported(table, "delete"),
        } as any;
      }

      if (table === "profiles") {
        return {
          select: () => new QueryChain(async () => {
            const context = await loadNewInvitationContext();
            return { data: context ? {
              plan: context.plan,
              has_used_free_trial: context.hasUsedFreeTrial,
              plan_expires_at: context.planExpiresAt,
            } : null, error: null };
          }),
          update: (values: Record<string, unknown>) => ({
            eq: async () => ({ data: values, error: null }),
          }),
        } as any;
      }

      if (table === "invitations") {
        return {
          select: (selection?: string, options?: unknown) => {
            const isIdOnly = selection === "id";
            const isEditorLoad = selection?.includes("themes(slug)");
            const isCountOnly = typeof options === "object" && options !== null && "count" in options;

            if (isEditorLoad) {
              return new QueryChain(async () => {
                const result = await loadInvitationEditor("");
                return { data: result?.invitation ?? null, error: null };
              });
            }

            if (isCountOnly) {
              return new QueryChain(async () => {
                const context = await loadNewInvitationContext();
                return { count: context?.invitationCount ?? 0, data: null, error: null };
              });
            }

            if (isIdOnly) {
              return new QueryChain(async () => ({ data: null, error: null }));
            }

            return new QueryChain(async () => {
              const context = await loadNewInvitationContext();
              return { data: context?.themes ?? [], error: null };
            });
          },
          insert: (values: any) => {
            const operation = async () => {
              const created = await createInvitationAction(values);
              return {
                data: created,
                error: null,
              };
            };
            return {
              select: () => ({ single: operation }),
            };
          },
          update: () => notSupported(table, "update"),
          delete: () => notSupported(table, "delete"),
        } as any;
      }

      if (table === "gift_accounts") {
        return {
          select: () => new QueryChain(async () => ({ data: [], error: null })),
          insert: () => notSupported(table, "insert; gift accounts are written atomically by createInvitation"),
          update: () => notSupported(table, "update"),
          delete: () => notSupported(table, "delete"),
        } as any;
      }

      return notSupported(table, "from");
    },

    storage: {
      from(bucket: string) {
        return {
          async upload(path: string, file: File, options?: { contentType?: string; upsert?: boolean }) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("kind", file.type.startsWith("audio/") ? "audio" : "image");
            const publicUrl = await uploadInvitationAssetAction(formData);
            return { data: { path, publicUrl }, error: null, options, bucket };
          },
          getPublicUrl(path: string) {
            return { data: { publicUrl: publicStorageUrl(bucket, path) } };
          },
        };
      },
    },

    rpc(name: string, args: Record<string, unknown>) {
      if (name === "update_invitation") {
        return updateInvitationAction({
          invitationId: String(args.p_invitation_id),
          giftAccountId: args.p_gift_account_id ? String(args.p_gift_account_id) : null,
          data: {
            username: String(args.p_username),
            bride_name: String(args.p_bride_name),
            groom_name: String(args.p_groom_name),
            bride_photo_url: (args.p_bride_photo_url as string | null) ?? null,
            groom_photo_url: (args.p_groom_photo_url as string | null) ?? null,
            love_story: (args.p_love_story as string | null) ?? null,
            akad_date: (args.p_akad_date as string | null) ?? null,
            akad_time: (args.p_akad_time as string | null) ?? null,
            akad_venue: (args.p_akad_venue as string | null) ?? null,
            akad_address: (args.p_akad_address as string | null) ?? null,
            akad_maps_url: (args.p_akad_maps_url as string | null) ?? null,
            reception_date: (args.p_reception_date as string | null) ?? null,
            reception_time: (args.p_reception_time as string | null) ?? null,
            reception_venue: (args.p_reception_venue as string | null) ?? null,
            reception_address: (args.p_reception_address as string | null) ?? null,
            reception_maps_url: (args.p_reception_maps_url as string | null) ?? null,
            theme_id: String(args.p_theme_id),
            theme_version_id: String(args.p_theme_version_id),
            music_url: (args.p_music_url as string | null) ?? null,
            cover_image_url: (args.p_cover_image_url as string | null) ?? null,
            custom_message: (args.p_custom_message as string | null) ?? null,
            is_published: Boolean(args.p_is_published),
            show_rsvp: Boolean(args.p_show_rsvp),
            show_gift: Boolean(args.p_show_gift),
            show_gallery: Boolean(args.p_show_gallery),
            show_wishes: Boolean(args.p_show_wishes),
            custom_data: (args.p_custom_data as Record<string, unknown>) ?? {},
            bank_name: (args.p_bank_name as string | null) ?? null,
            account_number: (args.p_account_number as string | null) ?? null,
            account_name: (args.p_account_name as string | null) ?? null,
          },
        });
      }

      notSupported("rpc", name);
    },
  };
}
