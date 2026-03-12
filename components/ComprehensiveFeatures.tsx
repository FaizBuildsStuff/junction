"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Zap, CreditCard, BrainCircuit, ChevronRight, Fingerprint, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const junctionFeatures = [
  {
    title: "Instant Virtual Card Issuance",
    desc: "Generate PCI-compliant virtual cards for specific vendors or projects. Set hard limits and kill-switches with a single tap.",
    icon: CreditCard,
    accent: "lime",
    label: "FINANCIAL INFRA"
  },
  {
    title: "Granular Spend Guardrails",
    desc: "Stop budget bleed before it happens. Use AI-driven policy enforcement to block non-compliant SaaS subscriptions automatically.",
    icon: ShieldCheck,
    accent: "forest",
    label: "GOVERNANCE"
  },
  {
    title: "Predictive Burn Analysis",
    desc: "Our ML engine identifies usage patterns in your dev-stack to forecast end-of-month invoices with 99.2% accuracy.",
    icon: BrainCircuit,
    accent: "lime",
    label: "COST INTELLIGENCE"
  },
];

export default function ComprehensiveFeatures() {
  const containerRef = useRef(null);
  const textSectionRef = useRef(null);
  const textureRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Background Texture Animation
      gsap.to(textureRef.current, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      const cards = gsap.utils.toArray(".feature-card") as HTMLElement[];
      
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Staggered text entrance
      mainTimeline.from(textSectionRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.5,
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        // Optimized Animation for Mobile Stability
        mainTimeline.fromTo(card, 
          { 
            y: "80vh", // Use vh instead of fixed pixels
            rotateX: -30, 
            scale: 0.85,
            opacity: 0 
          },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
          },
          `+=${index * 0.5}`
        );

        if (index > 0) {
            mainTimeline.to(cards[index-1], {
                scale: 0.92,
                opacity: 0.3,
                filter: "blur(4px)",
                duration: 0.8,
            }, `-=1.2`);
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
        ref={containerRef} 
        className="relative min-h-screen flex items-center bg-[#F2F9F1] py-20 md:py-32 px-4 md:px-16 overflow-hidden"
    >
      {/* Parallax Background */}
      <div 
        ref={textureRef}
        className="absolute inset-0 z-0 select-none pointer-events-none text-[#162C25]/5 font-black text-[30vw] md:text-[25vw] leading-none whitespace-nowrap flex items-center"
      >
        SCALE • ANALYZE • OPTIMIZE • PREDICT • 
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-center w-full relative z-10">
        
        {/* Left Side: Professional Content */}
        <div ref={textSectionRef} className="space-y-6 md:space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm">
            <Fingerprint className="text-[#162C25]" size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#162C25]">Identity-First Finance</span>
          </div>

          <h2 className="text-5xl md:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-[-0.06em] text-[#162C25]">
            Engineered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162C25] to-[#5E6D68]">
              For Velocity
            </span>
          </h2>

          <p className="max-w-md text-lg md:text-xl text-[#162C25]/70 leading-relaxed font-medium italic border-l-4 border-[#C8F064] pl-6">
            "Junction connects your engineering velocity directly to fiscal accountability. Automated guardrails and proactive forecasting."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Button className="bg-[#162C25] text-[#C8F064] text-[11px] font-black uppercase tracking-widest px-10 py-7 md:px-12 md:py-8 rounded-[1.5rem] md:rounded-[2rem] hover:scale-105 transition-transform shadow-xl shadow-[#162C25]/10">
                Get Early Access
             </Button>
             <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest px-8 py-7 md:py-8 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white transition-all">
                View Docs
             </Button>
          </div>
        </div>

        {/* Right Side: The Card Engine */}
        <div className="perspective-2000 relative h-[500px] md:h-[600px] w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          {junctionFeatures.map((item, index) => {
            const Icon = item.icon;
            const isLime = item.accent === "lime";

            return (
              <Card 
                key={index} 
                className={`feature-card absolute w-full max-w-[340px] sm:max-w-[450px] md:max-w-[500px] aspect-[4/5] p-6 md:p-10 flex flex-col justify-between rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(22,44,37,0.3)] border-none will-change-transform cursor-grab active:cursor-grabbing ${
                    isLime ? "bg-[#C8F064]" : "bg-[#162C25]"
                }`}
              >
                <CardHeader className="p-0 space-y-4 md:space-y-8">
                  <div className="flex justify-between items-center">
                     <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner ${isLime ? "bg-[#162C25]" : "bg-[#C8F064]"}`}>
                        <Icon size={20} className={isLime ? "text-[#C8F064]" : "text-[#162C25]"}/>
                     </div>
                     <div className={`px-3 py-1 rounded-full border text-[8px] md:text-[9px] font-black tracking-widest ${isLime ? "border-[#162C25]/20 text-[#162C25]/60" : "border-white/20 text-white/40"}`}>
                        {item.label}
                     </div>
                  </div>
                  <CardTitle className={`text-3xl md:text-5xl font-black leading-none tracking-tight ${isLime ? "text-[#162C25]" : "text-white"}`}>
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <p className={`text-sm md:text-lg font-medium leading-relaxed ${isLime ? "text-[#162C25]/80" : "text-white/70"}`}>
                    {item.desc}
                  </p>
                </CardContent>

                <CardFooter className="p-0">
                    <div className={`w-full group flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all ${isLime ? "bg-[#162C25] text-[#C8F064]" : "bg-[#C8F064] text-[#162C25]"}`}>
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Connect Service</span>
                        <ChevronRight className="group-hover:translate-x-2 transition-transform w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}