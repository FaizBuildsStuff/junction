import Hero from "@/components/Hero";
import TickerBar from "@/components/TickerBar";
import ComprehensiveFeatures from "@/components/ComprehensiveFeatures";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Integrations from "@/components/Integrations";
import FaqSection from "@/components/FaqSection";
import PremiumCTA from "@/components/PremiumCTA";
export default function Home() {
  return (
    <>
    <Hero />
    <TickerBar />
    <ComprehensiveFeatures />
    <Testimonials />
    <FinalCTA />  
    <Integrations />
    <FaqSection />
    <PremiumCTA />
    </>
  );
}
