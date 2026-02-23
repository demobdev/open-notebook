import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { LogoCloud } from "@/components/landing/LogoCloud"
import { CodeShowcase } from "@/components/landing/CodeShowcase"
import { UseCasesSection } from "@/components/landing/UseCasesSection"
import { ActivityLogSection } from "@/components/landing/ActivityLogSection"
import { ValuePropsSection } from "@/components/landing/ValuePropsSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { PricingSection } from "@/components/landing/PricingSection"
import { FAQSection } from "@/components/landing/FAQSection"
import { CommunitySection } from "@/components/landing/CommunitySection"
import { CTASection } from "@/components/landing/CTASection"
import { BlogPreview } from "@/components/landing/BlogPreview"
import { Footer } from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <LogoCloud />
        <CodeShowcase />
        <UseCasesSection />
        <ActivityLogSection />
        <ValuePropsSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CommunitySection />
        <CTASection />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  )
}
