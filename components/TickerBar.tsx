"use client";
import React, { useEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const JunctionFeatures = [
  "Expense Tracking",
  "Usage-Based Forecasting",
  "Infrastructure Burn Rate",
  "API Cost Management",
  "Staggering ROI",
  "Virtual Cards",
  "Real-Time Analytics",
  "Cloud Optimization",
];

export default function TickerBar() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // 1. Infinite Loop Animation
    // We animate the track to move left by 50% (since content is duplicated)
    const tl = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 25, // Adjust speed here
      repeat: -1,
    });

    // 2. Entrance Animation (Tilted Slide-in)
    gsap.fromTo(tickerRef.current, 
      { 
        y: 100, 
        opacity: 0, 
        rotate: 0, 
        scale: 0.9 
      },
      {
        y: 0,
        opacity: 1,
        rotate: -2,
        scale: 1.05,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: tickerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        }
      }
    );

    // 3. Hover Speed Effect
    const handleMouseEnter = () => gsap.to(tl, { timeScale: 0.2, duration: 0.5 });
    const handleMouseLeave = () => gsap.to(tl, { timeScale: 1, duration: 0.5 });

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tl.kill();
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Triple the features for a truly seamless loop at high speeds
  const duplicatedFeatures = [...JunctionFeatures, ...JunctionFeatures, ...JunctionFeatures];

  return (
    <section className="relative w-full overflow-hidden bg-[#F2F9F1] py-24 lg:py-40">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
        <div className="w-[60%] h-[40%] bg-[#C8F064]/30 rounded-full blur-[120px]" />
      </div>

      <div ref={tickerRef} className="relative z-10">
        <div className="w-full bg-[#162C25] py-8 md:py-12 shadow-[0_40px_80px_-15px_rgba(22,44,37,0.5)] border-y border-white/5 relative overflow-hidden">
          
          {/* Professional Edge Masks */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#162C25] via-[#162C25]/80 to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#162C25] via-[#162C25]/80 to-transparent z-20" />

          {/* GSAP Track */}
          <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
            {duplicatedFeatures.map((feature, index) => (
              <div 
                key={`${feature}-${index}`} 
                className="flex items-center gap-8 md:gap-16 px-10 md:px-16 group cursor-none"
              >
                <div className="p-3 bg-[#C8F064] rounded-2xl rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                  <Zap size={18} className="text-[#162C25] fill-[#162C25]" />
                </div>
                
                <span className="font-satoshi font-black text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white/90 transition-colors group-hover:text-[#C8F064]">
                  {feature}
                </span>

                <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-[#C8F064]/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#162C25]/5 font-black text-[15vw] select-none pointer-events-none whitespace-nowrap">
        RELIABILITY • SCALE • JUNCTION
      </div>
    </section>
  );
}