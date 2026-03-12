"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Sparkles } from "lucide-react";

export default function PremiumCTA() {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Continuous Float Animation
      gsap.to(".floating-shape", {
        y: "random(-20, 20)",
        rotation: "random(-10, 10)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Magnetic Mouse Effect
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = (cardRef.current as any).getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        gsap.to(glowRef.current, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 md:py-40 bg-[#F2F9F1] px-4 md:px-10 overflow-hidden font-satoshi">
      <div 
        ref={cardRef}
        className="max-w-7xl mx-auto relative bg-[#162C25] rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 overflow-hidden border border-white/5 shadow-[0_50px_100px_-20px_rgba(22,44,37,0.5)]"
      >
        {/* DYNAMIC BACKGROUND ELEMENTS */}
        <div ref={glowRef} className="absolute inset-0 bg-[#C8F064]/5 blur-[120px] pointer-events-none" />
        
        {/* Liquid Shapes (Framer-style aesthetics) */}
        <div className="floating-shape absolute -top-20 -right-20 w-64 h-64 bg-[#C8F064] rounded-full opacity-20 blur-3xl" />
        <div className="floating-shape absolute -bottom-20 -left-20 w-80 h-80 bg-[#C8F064] rounded-[40%] opacity-10 blur-3xl" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C8F064_1px,transparent_1px),linear-gradient(to_bottom,#C8F064_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05]" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md">
            <Sparkles size={16} className="text-[#C8F064]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Ready to Ascend?</span>
          </div>

          <h2 className="text-5xl md:text-[120px] font-black text-white tracking-[-0.07em] leading-[0.85] mb-12">
            Simplify Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8F064] via-white to-[#C8F064]">Management.</span>
          </h2>

          <p className="max-w-xl text-lg md:text-2xl text-white/40 font-medium leading-relaxed mb-16">
            Enter your email to join 200+ engineering teams optimizing their financial infrastructure with Junction.
          </p>

          {/* INPUT GROUP (Ultra Modern) */}
          <div className="w-full max-w-2xl relative group">
            <input 
              type="email" 
              placeholder="Enter your work email" 
              className="w-full bg-white/5 border border-white/10 py-8 px-10 rounded-[2.5rem] text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-[#C8F064]/20 transition-all font-bold text-lg"
            />
            <Button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#C8F064] text-[#162C25] h-[calc(100%-1.5rem)] px-10 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-transform flex gap-3">
              Get Started <ArrowRight size={18} />
            </Button>
          </div>

          {/* SOCIAL PROOF MINI-BADGE */}
          <div className="mt-16 flex items-center gap-4 opacity-30">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#162C25] bg-gray-500" />
                ))}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white">Trusted by 2k+ founders</p>
          </div>
        </div>
      </div>
    </section>
  );
}