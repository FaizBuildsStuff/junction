"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Zap, Globe, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const containerRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Reveal (Staggered)
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      
      tl.from(".reveal-item", {
        y: 80,
        opacity: 0,
        duration: 1.4,
        stagger: 0.1,
      })
      .from(".mockup-frame", {
        scale: 0.9,
        opacity: 0,
        duration: 2,
        ease: "power4.out"
      }, "-=1");

      // 2. Mouse Parallax Effect
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;

        gsap.to(".parallax-layer", {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100dvh] flex items-center bg-[#F2F9F1] pt-32 pb-20 px-6 lg:px-16 overflow-hidden selection:bg-[#C8F064] selection:text-[#162C25]"
    >
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center w-full relative z-10">
        
        {/* Left Content: Radical Clarity */}
        <div className="flex flex-col items-start">
          <div className="reveal-item inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#162C25]/5 mb-10 shadow-sm">
            <Fingerprint size={14} className="text-[#162C25]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]">Engineering First Finance</span>
          </div>

          <h1 className="reveal-item text-[clamp(3.5rem,8vw,8.5rem)] font-black leading-[0.85] tracking-[-0.07em] text-[#162C25] mb-12">
            The Hub For <br />
            <span className="flex items-center gap-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162C25] via-[#5E6D68] to-[#162C25]">Infrastructure</span>
              <span className="hidden md:inline-flex w-32 h-16 border-[3px] border-[#162C25] rounded-full items-center justify-center rotate-[-10deg]">
                <Globe size={28} className="text-[#162C25] animate-pulse" />
              </span>
            </span>
            <span className="block italic">Velocity.</span>
          </h1>

          <p className="reveal-item max-w-lg text-xl md:text-2xl text-[#162C25]/60 mb-14 leading-relaxed font-medium">
            Junction connects your development velocity directly to fiscal accountability. Automated guardrails for modern engineering teams.
          </p>

          <div className="reveal-item flex flex-col sm:flex-row items-stretch gap-4 w-full sm:w-auto">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter work email"
                className="w-full sm:w-80 bg-white border-2 border-[#162C25]/5 px-8 py-5 rounded-2xl outline-none focus:border-[#C8F064] transition-all font-bold text-[#162C25]"
              />
            </div>
            <Button className="bg-[#162C25] text-[#C8F064] px-12 py-8 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
              Deploy Junction <ArrowUpRight className="ml-2" size={18} />
            </Button>
          </div>
          
          <div className="reveal-item mt-16 flex items-center gap-8 opacity-40">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-[3px] border-[#F2F9F1] bg-[#162C25]/20" />)}
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest">Trusted by 200+ fast-growing startups</p>
          </div>
        </div>

        {/* Right Visual: The 3D Mockup Engine */}
        <div ref={visualRef} className="relative flex items-center justify-center lg:justify-end h-full">
          <div className="parallax-layer mockup-frame relative z-20 w-full max-w-[420px] aspect-[9/18.5] bg-[#162C25] rounded-[4rem] p-4 shadow-[0_50px_100px_-20px_rgba(22,44,37,0.3)]">
            {/* The Internal Dashboard UI */}
            <div className="w-full h-full bg-[#F2F9F1] rounded-[3.2rem] overflow-hidden flex flex-col p-8">
                <div className="flex justify-between items-center mb-10">
                   <Zap size={24} className="fill-[#C8F064] text-[#C8F064]" />
                   <div className="w-10 h-10 rounded-2xl bg-[#162C25] flex items-center justify-center">
                      <ShieldCheck size={18} className="text-[#C8F064]" />
                   </div>
                </div>

                <div className="space-y-2 mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Total Burn Efficiency</p>
                    <h3 className="text-5xl font-black text-[#162C25] tracking-tighter">94.2%</h3>
                    <div className="w-full h-1 bg-[#162C25]/5 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-[#C8F064]" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-white rounded-3xl border border-[#162C25]/5">
                      <p className="text-[8px] font-black opacity-30 uppercase mb-2">AWS Usage</p>
                      <p className="text-sm font-black">$421.10</p>
                   </div>
                   <div className="p-4 bg-[#C8F064] rounded-3xl">
                      <p className="text-[8px] font-black opacity-50 uppercase mb-2">Trend</p>
                      <p className="text-sm font-black">+2.4%</p>
                   </div>
                </div>

                <div className="flex-1 bg-white rounded-[2.5rem] p-6 shadow-sm border border-[#162C25]/5">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Active Stack</span>
                      <span className="text-[9px] font-black text-[#C8F064] bg-[#162C25] px-2 py-0.5 rounded-full">LIVE</span>
                   </div>
                   <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-[#F2F9F1]" />
                           <div className="flex-1 h-2 bg-[#162C25]/5 rounded-full" />
                           <div className="w-10 h-2 bg-[#162C25]/10 rounded-full" />
                        </div>
                      ))}
                   </div>
                </div>
            </div>
          </div>

          {/* Floating Abstract Element */}
          <div className="parallax-layer absolute -left-10 bottom-20 z-30 bg-[#C8F064] p-8 rounded-[3rem] shadow-2xl rotate-12 hidden md:block border-[10px] border-[#F2F9F1]">
             <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-[#162C25]">12k</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 text-center">Requests <br /> Per Second</span>
             </div>
          </div>

          {/* Decorative Circle Grid */}
          <div className="absolute -z-10 top-0 right-0 w-[500px] h-[500px] bg-[#C8F064]/20 blur-[120px] rounded-full" />
        </div>
      </div>
    </section>
  );
}