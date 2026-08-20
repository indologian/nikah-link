import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhySection from "@/components/landing/WhySection";
import ThemeCarousel from "@/components/landing/ThemeCarousel";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import EcoImpact from "@/components/landing/EcoImpact";
import VendorPreview from "@/components/landing/VendorPreview";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FaqSection from "@/components/landing/FaqSection";
import LeadMagnetSection from "@/components/landing/LeadMagnetSection";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const THEME_SELECT =
  "id, name, slug, component_key, category, thumbnail_url, colors, is_premium, is_active, sort_order, created_at";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("config")
    .eq("id", 1)
    .single();

  const defaultConfig = {
    showHero: true,
    showWhy: true,
    showThemes: true,
    showFeatures: true,
    showHowItWorks: true,
    showEcoImpact: true,
    showVendor: true,
    showPricing: true,
    showTestimonial: true,
    showLeadMagnet: true,
    showFaq: true,
  };

  let { data: themes, error: themesError } = await supabase
    .from("themes")
    .select(THEME_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (themesError || !themes?.length) {
    const fallback = await supabaseAdmin
      .from("themes")
      .select(THEME_SELECT)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fallback.error) {
      console.error("Failed to load homepage themes", {
        publicError: themesError?.message,
        fallbackError: fallback.error.message,
      });
    } else {
      themes = fallback.data;
    }
  }

  const config = { ...defaultConfig, ...(settings?.config || {}) };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      {config.showHero && <HeroSection />}
      {config.showWhy && <WhySection />}
      {config.showFeatures && <FeaturesSection />}
      {config.showThemes && <ThemeCarousel themes={themes || []} />}
      {config.showHowItWorks && <HowItWorks />}
      {config.showTestimonial && <TestimonialSection />}
      {config.showPricing && <PricingSection />}
      {config.showLeadMagnet && <LeadMagnetSection />}
      {config.showEcoImpact && <EcoImpact />}
      {config.showVendor && <VendorPreview />}
      {config.showFaq && <FaqSection />}
      <Footer />
    </main>
  );
}
