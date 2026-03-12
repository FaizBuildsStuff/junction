"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Zap } from "lucide-react";
import { theme } from "@/theme/theme";

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(".animate-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });
      
      gsap.from(".animate-card", {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "elastic.out(1, 0.75)",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-20 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content */}
        <div ref={textRef} className="z-10">
          <div className="flex items-center gap-2 mb-6 animate-text">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Welcome to</span>
            <span className="bg-[#C8F064] text-[#162C25] px-3 py-1 rounded-full text-xs font-bold uppercase">
              Junction
            </span>
          </div>

          <h1 className="animate-text text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter text-[#162C25] mb-8">
            Streamline <br />
            <span className="flex items-center gap-4">
               {/* The Pill Icon from Design */}
              <span className="inline-flex items-center justify-center w-20 h-10 md:w-24 md:h-12 border-2 border-[#162C25] rounded-full">
                <span className="w-8 h-8 md:w-10 md:h-10 bg-[#162C25] rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-[#C8F064] fill-[#C8F064]" />
                </span>
              </span>
              Your
            </span>
            Stack Costs<sup className="text-2xl top-[-1.5em] ml-2 font-medium">®</sup>
          </h1>

          <p className="animate-text max-w-md text-lg text-[#5E6D68] mb-10 leading-relaxed">
            Effortlessly track dev-tool expenses, predict usage spikes, and manage your infrastructure burn—all in one hub.
          </p>

          <div className="animate-text flex items-center bg-white rounded-full p-1.5 shadow-sm max-w-md border border-black/5">
            <input 
              type="text" 
              placeholder="Enter your work email" 
              className="flex-1 bg-transparent px-6 outline-none text-sm"
            />
            <button className="bg-[#162C25] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1D3A32] transition-colors">
              Try it free
            </button>
          </div>
        </div>

        {/* Right Side: The Visuals */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Main Mobile Mockup Wrapper */}
<div className="animate-card relative z-20 w-[280px] md:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-black shadow-2xl overflow-hidden">
  
  {/* The Screen Content */}
  <div className="w-full h-full bg-[#F2F9F1] overflow-hidden flex flex-col font-satoshi">
    
    {/* Status Bar Mockup */}
    <div className="h-10 w-full flex justify-between items-center px-8 pt-4">
      <span className="text-[10px] font-bold">9:41</span>
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-black/10" />
        <div className="w-3 h-3 rounded-full bg-black/10" />
      </div>
    </div>

    {/* App Header */}
    <div className="px-6 py-4 flex justify-between items-center">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
        <div className="w-4 h-[2px] bg-forest" />
      </div>
      <span className="font-bold text-xs uppercase tracking-widest text-forest">Junction</span>
      <div className="w-8 h-8 bg-[#C8F064] rounded-full flex items-center justify-center shadow-sm">
        <Zap size={12} className="fill-forest" />
      </div>
    </div>

    {/* Main Stack Cost Card */}
    <div className="px-5">
      <div className="w-full bg-forest rounded-[2rem] p-5  shadow-lg relative overflow-hidden">
        {/* Abstract Background Shape */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-lime/20 rounded-full blur-2xl" />
        
        <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Total Burn • March</p>
        <h3 className="text-2xl font-bold mb-6">$1,284.50</h3>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] opacity-40 uppercase">Active Stack</p>
            <p className="text-[10px] font-medium">12 Services Connected</p>
          </div>
          <div className="bg-lime text-forest px-3 py-1 rounded-full text-[9px] font-bold">
            +2.4%
          </div>
        </div>
      </div>
    </div>

    {/* Mini Chart Mockup */}
    <div className="px-5 mt-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-forest">Usage Velocity</span>
        <span className="text-[10px] opacity-50">Last 7 Days</span>
      </div>
      <div className="flex items-end justify-between h-16 gap-1 px-2">
        {[40, 70, 45, 90, 65, 80, 95].map((height, i) => (
          <div 
            key={i} 
            className={`w-full rounded-t-sm transition-all duration-1000 ${i === 6 ? 'bg-lime' : 'bg-forest/10'}`} 
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>

    {/* Transaction Feed */}
    <div className="px-5 mt-8 flex-1 bg-white rounded-t-[2.5rem] pt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-forest uppercase tracking-tight">Recent Infrastructure</span>
        <span className="text-[9px] text-lime-600 font-bold">See All</span>
      </div>
      
      <div className="space-y-4">
        {[
          { label: 'Vercel Edge', cost: '-$42.00', icon: 'V' },
          { label: 'OpenAI API', cost: '-$128.12', icon: 'O' },
          { label: 'Supabase DB', cost: '-$25.00', icon: 'S' },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F2F9F1] rounded-xl flex items-center justify-center text-[10px] font-bold text-forest border border-black/5">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-forest">{item.label}</p>
                <p className="text-[8px] opacity-40">Today, 10:45 AM</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-forest">{item.cost}</span>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

          {/* Background Accent Shape (The Lime box) */}
          <div className="animate-card absolute -right-4 top-10 w-[80%] h-[90%] bg-[#C8F064] rounded-[2.5rem] -z-10 flex flex-col justify-end p-10">
              <div className="text-[#162C25]">
                 <div className="flex items-center gap-2 text-2xl font-bold mb-1">
                    Predictive <Zap size={20} className="fill-current" />
                 </div>
                 <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-4">Analytics</div>
                 <button className="flex items-center gap-2 text-xs font-bold border-b border-[#162C25] pb-1">
                    VIEW DASHBOARD <ArrowUpRight size={14} />
                 </button>
              </div>
          </div>

          {/* Floating Rating Card */}
          <div className="animate-card absolute left-[-20px] top-20 bg-white p-5 rounded-3xl shadow-xl z-30 flex flex-col items-center">
             <div className="text-2xl font-bold text-[#162C25]">4.9 <span className="text-sm opacity-50">/5</span></div>
             <p className="text-[10px] text-center opacity-60 mb-2">platform users <br/> feedback</p>
             <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Zap key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                ))}
             </div>
          </div>
        </div>

      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-8 right-12 hidden lg:block opacity-40 text-xs font-bold uppercase tracking-widest">
        All Rights Reserved
      </div>
    </section>
  );
}