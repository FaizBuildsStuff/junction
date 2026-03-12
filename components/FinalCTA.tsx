"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Train, Cpu, Gauge, Radio, Activity } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const trainChassisRef = useRef(null);
  const doorLRef = useRef(null);
  const doorRRef = useRef(null);
  const uiContentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
        },
      });

      // 1. Initial State: Content hidden, Train off-screen, but Items VISIBLE
      tl.set(uiContentRef.current, { opacity: 0 });

      // 2. High-Velocity Items Move Past
      tl.to(".scrolling-item", { 
        y: (i) => (i % 2 === 0 ? -400 : 400), 
        opacity: 0, 
        duration: 1.5 
      })
      .to(".rail-track", { scaleX: 1.5, opacity: 0.5, duration: 1 }, "-=1.5");

      // 3. Train Arrival
      tl.fromTo(trainChassisRef.current, 
        { x: "-120vw", opacity: 1 }, 
        { x: "0%", duration: 2, ease: "power3.inOut" }
      );

      // 4. Hydraulic Reveal
      tl.to(doorLRef.current, { x: "-100%", duration: 1.5, ease: "expo.inOut" }, "reveal")
        .to(doorRRef.current, { x: "100%", duration: 1.5, ease: "expo.inOut" }, "reveal");

      // 5. Text Reveal
      tl.to(uiContentRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        startAt: { scale: 0.9, filter: "blur(10px)" }
      }, "-=0.8");

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#F2F9F1] overflow-hidden flex items-center justify-center font-satoshi">
      
      {/* 1. SCROLLING TECH ITEMS (Visible at start, no overflow) */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="scrolling-item absolute top-[15%] left-[10%] bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-[#162C25]/10 shadow-sm">
            <Cpu className="text-[#162C25] w-6 h-6 md:w-8 md:h-8" />
         </div>
         <div className="scrolling-item absolute bottom-[20%] left-[15%] bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-[#162C25]/10">
            <Gauge className="text-[#162C25] w-6 h-6 md:w-8 md:h-8" />
         </div>
         <div className="scrolling-item absolute top-[20%] right-[10%] bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-[#162C25]/10">
            <Radio className="text-[#162C25] w-6 h-6 md:w-8 md:h-8" />
         </div>
         <div className="scrolling-item absolute bottom-[25%] right-[15%] bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-[#162C25]/10">
            <Activity className="text-[#162C25] w-6 h-6 md:w-8 md:h-8" />
         </div>
      </div>

      {/* 2. RAIL TRACKS */}
      <div className="rail-track absolute bottom-[15vh] w-full h-[1px] bg-[#162C25]/10 z-0" />
      <div className="rail-track absolute bottom-[14.5vh] w-full h-[6px] bg-[#C8F064]/20 blur-md z-0" />

      {/* 3. THE BULLET TRAIN (Responsive widths) */}
      <div ref={trainChassisRef} className="relative w-[95vw] lg:w-[85vw] h-[70vh] md:h-[75vh] bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(22,44,37,0.12)] flex items-center justify-center overflow-hidden border border-[#162C25]/5 z-10">
        
        {/* LIGHT THEME REFLECTION */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white via-transparent to-[#C8F064]/5 pointer-events-none z-10" />

        {/* DOORS (Forest Green) */}
        <div ref={doorLRef} className="absolute inset-y-0 left-0 w-1/2 bg-[#162C25] z-40 border-r border-white/10 flex flex-col justify-between p-6 md:p-12">
            <div className="w-12 md:w-20 h-1 bg-[#C8F064]/30 rounded-full" />
            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C8F064] animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black text-white/40 tracking-[0.3em] md:tracking-[0.6em]">TERMINAL_ACTIVE</span>
            </div>
        </div>
        
        <div ref={doorRRef} className="absolute inset-y-0 right-0 w-1/2 bg-[#162C25] z-40 border-l border-white/10 flex flex-col justify-between items-end p-6 md:p-12">
            <div className="w-12 md:w-20 h-1 bg-[#C8F064]/30 rounded-full" />
            <Train size={24} className="text-white/10 md:w-8 md:h-8" />
        </div>

        {/* CONTENT (Scaling for Mobile) */}
        <div ref={uiContentRef} className="relative z-20 text-center px-4 md:px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#162C25] rounded-full mb-6 md:mb-10 shadow-lg shadow-[#162C25]/20">
            <Zap size={14} className="text-[#C8F064] fill-[#C8F064]" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#C8F064]">Premium Departure</span>
          </div>

          <h2 className="text-[12vw] md:text-[110px] font-black text-[#162C25] tracking-[-0.06em] leading-[0.9] md:leading-[0.85] mb-8 md:mb-12">
            Arrive At <br /> 
            <span className="text-[#C8F064] bg-[#162C25] px-4 md:px-6 py-1 md:py-2 rounded-xl md:rounded-3xl inline-block mt-2">Zero Burn.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Button className="w-full sm:w-auto bg-[#162C25] text-[#C8F064] px-10 py-7 md:px-14 md:py-9 rounded-full text-[11px] md:text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
              Join The Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-[#162C25]/40 hover:text-[#162C25] px-8 py-7 text-[11px] md:text-[12px] font-black uppercase tracking-widest">
              View Roadmap
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}