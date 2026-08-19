-- ============================================================
-- NikahLink - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- THEMES TABLE
-- ============================================================
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('minimalis', 'floral', 'elegan', 'budaya', 'dark', 'romantic')),
  thumbnail_url TEXT,
  preview_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  colors JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial themes
INSERT INTO themes (name, slug, category, is_premium, sort_order) VALUES
('Minimalist Clean', 'minimalis', 'minimalis', false, 1),
('Vintage Elegance', 'vintage-elegance', 'minimalis', true, 2),
('Royal Botanical', 'royal-botanical', 'floral', true, 3),
('Wayang Classic', 'wayang-classic', 'budaya', true, 4),
('Elegant Blush', 'elegant-blush', 'elegan', true, 5),
('Midnight Sparkle', 'midnight-sparkle', 'dark', true, 6),
('Serein White', 'serein-white', 'minimalis', true, 7),
('Balinese Harmony', 'balinese-harmony', 'budaya', true, 8),
('Magazine Cover', 'magazine-cover', 'elegan', true, 9),
('Javanese Batik', 'javanese-batik', 'budaya', true, 10),
('Line Art Botanical', 'line-art-botanical', 'floral', true, 11),
('Royal Gold', 'royal-gold', 'elegan', true, 12),
('Ocean Breeze', 'ocean-breeze', 'minimalis', true, 13),
('Rustic Woodland', 'rustic-woodland', 'floral', true, 14),
('Modern Monochrome', 'modern-monochrome', 'dark', true, 15),
('Cosmic Starlight', 'cosmic-starlight', 'dark', true, 16),
('Ethereal Watercolor', 'ethereal-watercolor', 'elegan', true, 17),
('Heritage Gunungan', 'heritage-gunungan', 'budaya', true, 18),
('Botanical Elegance', 'botanical-elegance', 'floral', true, 19),
('Golden Arch', 'golden-arch', 'elegan', true, 20),
('Terracotta Rust', 'terracotta-rust', 'elegan', true, 21),
('Ethereal Snow', 'ethereal-snow', 'elegan', true, 22),
('Geometric Abstract', 'geometric-abstract', 'elegan', true, 23),
('Editorial Gallery', 'editorial-gallery', 'elegan', true, 24)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INVITATIONS TABLE
-- ============================================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Couple info
  bride_name TEXT NOT NULL DEFAULT '',
  groom_name TEXT NOT NULL DEFAULT '',
  bride_photo_url TEXT,
  groom_photo_url TEXT,
  love_story TEXT,
  couple_hashtag TEXT,

  -- Akad event
  akad_date DATE,
  akad_time TIME,
  akad_venue TEXT,
  akad_address TEXT,
  akad_maps_url TEXT,

  -- Resepsi event
  reception_date DATE,
  reception_time TIME,
  reception_venue TEXT,
  reception_address TEXT,
  reception_maps_url TEXT,

  -- Second resepsi (optional)
  reception2_date DATE,
  reception2_time TIME,
  reception2_venue TEXT,
  reception2_address TEXT,
  reception2_maps_url TEXT,

  -- Customization
  theme_id UUID REFERENCES themes(id),
  music_url TEXT,
  cover_image_url TEXT,
  custom_message TEXT,
  livestream_url TEXT,
  opening_text TEXT DEFAULT 'Bersama keluarga besar kami, kami mengundang Bapak/Ibu/Saudara/i',
  custom_data JSONB DEFAULT '{}'::jsonb,

  -- Settings
  is_published BOOLEAN DEFAULT FALSE,
  show_rsvp BOOLEAN DEFAULT TRUE,
  show_gift BOOLEAN DEFAULT TRUE,
  show_gallery BOOLEAN DEFAULT TRUE,
  show_wishes BOOLEAN DEFAULT TRUE,
  show_livestream BOOLEAN DEFAULT FALSE,
  rsvp_deadline DATE,

  -- Metadata
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- GUESTS TABLE
-- ============================================================
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  session TEXT DEFAULT 'all' CHECK (session IN ('pagi', 'siang', 'malam', 'all')),
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'hadir', 'tidak_hadir')),
  guest_count INTEGER DEFAULT 1,
  confirmation_date TIMESTAMPTZ,
  notes TEXT,
  qr_token TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
  is_checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WISHES TABLE
-- ============================================================
CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL DEFAULT 'Anonim',
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GALLERY TABLE
-- ============================================================
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIFT ACCOUNTS TABLE
-- ============================================================
CREATE TABLE gift_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('bank', 'ewallet', 'qris')),
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  qris_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIFT TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE gift_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL DEFAULT 'Anonim',
  amount INTEGER DEFAULT 0,
  note TEXT,
  method TEXT,
  is_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVITATION ANALYTICS TABLE
-- ============================================================
CREATE TABLE invitation_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VENDORS TABLE
-- ============================================================
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'fotografi', 'katering', 'dekorasi', 'wo', 'rias', 'videografi',
    'gaun', 'jas', 'sound', 'mc', 'musik', 'souvenir', 'kue',
    'mobil', 'gedung', 'florist', 'honeymoon', 'photobooth', 'seserahan'
  )),
  city TEXT NOT NULL,
  description TEXT,
  price_from INTEGER,
  portfolio_images JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  rating_avg DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  category TEXT,
  tags JSONB DEFAULT '[]',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS TABLE (for Midtrans payments)
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'pro')),
  invitation_id UUID REFERENCES invitations(id),
  midtrans_order_id TEXT UNIQUE,
  midtrans_transaction_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled', 'expired')),
  payment_method TEXT,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Themes: public read
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes are publicly readable" ON themes FOR SELECT USING (is_active = TRUE);

-- Blog posts: public read
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON blog_posts FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Invitations policies
CREATE POLICY "Users can CRUD own invitations" ON invitations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Published invitations are public" ON invitations FOR SELECT USING (is_published = TRUE);

-- Guests policies
CREATE POLICY "Invitation owners manage guests" ON guests FOR ALL
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can read guests with token" ON guests FOR SELECT
  USING (TRUE);

-- Wishes policies
CREATE POLICY "Invitation owners manage wishes" ON wishes FOR ALL
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can insert wishes to published invitations" ON wishes FOR INSERT
  WITH CHECK (invitation_id IN (SELECT id FROM invitations WHERE is_published = TRUE));
CREATE POLICY "Wishes are publicly readable" ON wishes FOR SELECT USING (is_approved = TRUE);

-- Gallery policies
CREATE POLICY "Invitation owners manage gallery" ON gallery FOR ALL
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));
CREATE POLICY "Gallery is public for published invitations" ON gallery FOR SELECT
  USING (invitation_id IN (SELECT id FROM invitations WHERE is_published = TRUE));

-- Gift accounts policies
CREATE POLICY "Invitation owners manage gift accounts" ON gift_accounts FOR ALL
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));
CREATE POLICY "Gift accounts public for published invitations" ON gift_accounts FOR SELECT
  USING (invitation_id IN (SELECT id FROM invitations WHERE is_published = TRUE));

-- Gift transactions
CREATE POLICY "Invitation owners view gift transactions" ON gift_transactions FOR SELECT
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can insert gift transactions" ON gift_transactions FOR INSERT
  WITH CHECK (invitation_id IN (SELECT id FROM invitations WHERE is_published = TRUE));

-- Invitation views
CREATE POLICY "Anyone can insert views" ON invitation_views FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Owners can view analytics" ON invitation_views FOR SELECT
  USING (invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid()));

-- Vendors: public read
CREATE POLICY "Vendors are publicly readable" ON vendors FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Vendors can manage own profile" ON vendors FOR ALL USING (auth.uid() = user_id);

-- Subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard > Storage:
-- 1. "invitation-photos" (public)
-- 2. "gallery-photos" (public)
-- 3. "user-avatars" (public)
-- 4. "invitation-music" (private)
-- 5. "vendor-portfolios" (public)
-- 6. "qris-codes" (public)
-- ============================================================

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Invitation with stats
CREATE OR REPLACE VIEW invitation_stats AS
SELECT
  i.id,
  i.user_id,
  i.username,
  i.bride_name,
  i.groom_name,
  i.is_published,
  i.reception_date,
  COUNT(DISTINCT g.id) AS total_guests,
  COUNT(DISTINCT CASE WHEN g.rsvp_status = 'hadir' THEN g.id END) AS rsvp_hadir,
  COUNT(DISTINCT CASE WHEN g.rsvp_status = 'tidak_hadir' THEN g.id END) AS rsvp_tidak_hadir,
  COUNT(DISTINCT CASE WHEN g.rsvp_status = 'pending' THEN g.id END) AS rsvp_pending,
  COUNT(DISTINCT w.id) AS total_wishes,
  COUNT(DISTINCT v.id) AS total_views,
  i.created_at
FROM invitations i
LEFT JOIN guests g ON g.invitation_id = i.id
LEFT JOIN wishes w ON w.invitation_id = i.id
LEFT JOIN invitation_views v ON v.invitation_id = i.id
GROUP BY i.id;
-- ============================================================
-- LEADS TABLE
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  source TEXT DEFAULT 'homepage_lead_magnet',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Only authenticated admins can view leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
