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

export default async function HomePage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("config")
    .eq("id", 1)
    .single();

  const config = settings?.config || {
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

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      {config.showHero && <HeroSection />}
      {config.showWhy && <WhySection />}
      {config.showFeatures && <FeaturesSection />}
      {config.showThemes && <ThemeCarousel />}
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
