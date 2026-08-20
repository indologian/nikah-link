// TypeScript types for NikahLink

export type Plan = "free" | "premium" | "pro";
export type RsvpStatus = "pending" | "hadir" | "tidak_hadir";
export type Session = "pagi" | "siang" | "malam" | "all";
export type VendorCategory =
  | "fotografi" | "katering" | "dekorasi" | "wo" | "rias" | "videografi"
  | "gaun" | "jas" | "sound" | "mc" | "musik" | "souvenir" | "kue"
  | "mobil" | "gedung" | "florist" | "honeymoon";

export type GiftAccountType = "bank" | "ewallet" | "qris";
export type InvitationStatus = "draft" | "published" | "archived";
export type ThemeVersionLifecycleStatus = "draft" | "published" | "archived";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  plan: Plan;
  role?: "user" | "super_admin";
  created_at: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  component_key: string;
  category: string;
  thumbnail_url: string;
  preview_url?: string;
  is_premium: boolean;
  is_active: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  editor_config?: Record<string, unknown>;
  fields_schema?: unknown[];
  assets?: Record<string, unknown>;
  created_at: string;
}

export interface ThemeVersion {
  id: string;
  theme_id: string;
  version: number;
  component_key: string;
  config: Record<string, unknown>;
  fields_schema: unknown[];
  colors: Record<string, string>;
  assets: Record<string, unknown>;
  is_published: boolean;
  lifecycle_status: ThemeVersionLifecycleStatus;
  created_at: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  username: string;
  status: InvitationStatus;
  bride_name: string;
  groom_name: string;
  bride_photo_url?: string;
  groom_photo_url?: string;
  love_story?: string;
  akad_date?: string;
  akad_time?: string;
  akad_venue?: string;
  akad_address?: string;
  akad_maps_url?: string;
  reception_date?: string;
  reception_time?: string;
  reception_venue?: string;
  reception_address?: string;
  reception_maps_url?: string;
  reception2_date?: string;
  reception2_time?: string;
  reception2_venue?: string;
  reception2_address?: string;
  reception2_maps_url?: string;
  theme_id?: string;
  theme_version_id?: string;
  theme?: Theme;
  theme_version?: ThemeVersion;
  music_url?: string;
  cover_image_url?: string;
  custom_message?: string;
  livestream_url?: string;
  is_published: boolean;
  show_rsvp: boolean;
  show_gift: boolean;
  show_gallery: boolean;
  show_wishes: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string; invitation_id: string; name: string; phone?: string; email?: string;
  session: Session; rsvp_status: RsvpStatus; guest_count?: number; confirmation_date?: string;
  notes?: string; qr_token: string; created_at: string;
}
export interface Wish { id: string; invitation_id: string; guest_id?: string; guest_name: string; message: string; created_at: string; }
export interface GalleryItem { id: string; invitation_id: string; image_url: string; caption?: string; order_index: number; created_at: string; }
export interface GiftAccount { id: string; invitation_id: string; type: GiftAccountType; bank_name?: string; account_number?: string; account_name?: string; qris_url?: string; }
export interface GiftTransaction { id: string; invitation_id: string; guest_name: string; amount: number; note?: string; method: string; created_at: string; }
export interface Transaction { id: string; user_id: string; amount: number; plan_name: string; status: string; payment_method?: string; created_at: string; }
export interface Vendor { id: string; user_id?: string; name: string; slug: string; category: VendorCategory; city: string; description?: string; price_from?: number; portfolio_images?: string[]; contact_info?: { phone?: string; instagram?: string; website?: string; }; rating_avg: number; review_count: number; is_verified: boolean; created_at: string; }
export interface BlogPost { id: string; title: string; slug: string; content: string; excerpt?: string; featured_image?: string; author_id?: string; published_at?: string; category?: string; tags?: string[]; created_at: string; }
export interface DashboardStats { totalGuests: number; rsvpHadir: number; rsvpTidakHadir: number; rsvpPending: number; totalWishes: number; totalViews: number; daysUntilWedding: number; }
