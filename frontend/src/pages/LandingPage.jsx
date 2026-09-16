import { useEffect } from "react";

// Modular Landing Page Components
import LandingNavbar from "./LandingPage/components/LandingNavbar";
import HeroSection from "./LandingPage/components/HeroSection";
import MetricsBar from "./LandingPage/components/MetricsBar";
import TemplateShowcase from "./LandingPage/components/TemplateShowcase";
import InteractiveSteps from "./LandingPage/components/InteractiveSteps";
import AtsScannerPreview from "./LandingPage/components/AtsScannerPreview";
import FeatureSuite from "./LandingPage/components/FeatureSuite";
import ResumeExamples from "./LandingPage/components/ResumeExamples";
import ExportFormats from "./LandingPage/components/ExportFormats";
import PricingSection from "./LandingPage/components/PricingSection";
import TestimonialsSection from "./LandingPage/components/TestimonialsSection";
import FaqAccordion from "./LandingPage/components/FaqAccordion";
import CtaBanner from "./LandingPage/components/CtaBanner";
import LandingFooter from "./LandingPage/components/LandingFooter";

const LandingPage = () => {
  useEffect(() => {
    // Set descriptive page title and scroll to top on mount
    document.title = "Resuma | Smart, ATS-Friendly Resume & Cover Letter Builder";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* 1. Global Sticky Navigation */}
      <LandingNavbar />

      <main className="flex-1 w-full">
        {/* 2. Interactive 3D Hero Section with Live Resume Sandbox */}
        <HeroSection />

        {/* 3. Authority Metrics Bar */}
        <MetricsBar />

        {/* 4. Interactive Template Gallery */}
        <TemplateShowcase />

        {/* 5. 4-Step Interactive Workflow */}
        <InteractiveSteps />

        {/* 6. Signature ATS X-Ray Scanner Preview */}
        <AtsScannerPreview />

        {/* 7. Comprehensive Career Suite Tools */}
        <FeatureSuite />

        {/* 8. Role-Specific Resume Examples Library */}
        <ResumeExamples />

        {/* 9. Universal Multi-Format Export Options */}
        <ExportFormats />

        {/* 10. Transparent, Honest Pricing */}
        <PricingSection />

        {/* 11. Social Proof & Candidate Reviews */}
        <TestimonialsSection />

        {/* 12. Interactive FAQ Accordion */}
        <FaqAccordion />

        {/* 13. High-Converting Bottom CTA Banner */}
        <CtaBanner />
      </main>

      {/* 14. Grand Brand Footer with Stylized Watermark */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
