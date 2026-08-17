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
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      <HeroSection />
      <WhySection />
      <ThemeCarousel />
      <FeaturesSection />
      <HowItWorks />
      <EcoImpact />
      <VendorPreview />
      <PricingSection />
      <TestimonialSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
