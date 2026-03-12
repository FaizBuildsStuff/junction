"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus, Search, HelpCircle, ThumbsUp, ThumbsDown, MessageSquare, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqData = [
  {
    q: "How quickly can I get setup?",
    a: "Our rapid-integration engine allows most teams to sync their entire financial stack in under 60 seconds. Just connect your API keys and watch the data flow.",
  },
  {
    q: "What does Junction integrate with?",
    a: "We support 40+ popular tools including AWS, Stripe, Vercel, and Slack. If your stack has an API, Junction can track the burn and optimize the flow.",
  },
  {
    q: "Can Junction help with compliance?",
    a: "Absolutely. We offer automated SOC2-ready reporting and real-time policy enforcement to ensure your engineering spend stays within fiscal guardrails.",
  },
  {
    q: "How much does it cost?",
    a: "We operate on a flexible 'Pay-as-you-Scale' model. Start for free to find your footing, and only pay as your infrastructure footprint expands.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef(null);
  const searchRef = useRef(null);


  return (
    <section ref={sectionRef} className="py-32 md:py-48 bg-[#F2F9F1] px-4 md:px-10 overflow-hidden font-satoshi relative">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C8F064]/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER BLOCK */}
        <div className="text-center mb-24">
          <div className="faq-bento-item inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 mb-8 shadow-sm">
            <HelpCircle size={14} className="text-[#162C25]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]">Intelligence Terminal</span>
          </div>
          
          <h2 className="faq-bento-item text-6xl md:text-[100px] font-black text-[#162C25] tracking-[-0.07em] leading-[0.85] mb-12">
            Ask Us <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162C25] to-[#5E6D68]">Anything.</span>
          </h2>

          {/* MAGNETIC SEARCH BAR */}
          <div ref={searchRef} className="faq-bento-item relative max-w-2xl mx-auto group">
             <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#162C25]/20 group-hover:text-[#C8F064] transition-colors" size={20} />
             <input 
                type="text" 
                placeholder="Search the documentation..." 
                className="w-full bg-white border border-[#162C25]/5 py-8 pl-20 pr-10 rounded-[2.5rem] shadow-2xl shadow-[#162C25]/5 focus:outline-none focus:ring-4 focus:ring-[#C8F064]/30 transition-all text-base font-bold text-[#162C25]"
             />
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT BENTO: FEATURED BOX */}
          <div className="faq-bento-item lg:col-span-5 bg-[#162C25] p-10 md:p-14 rounded-[4rem] shadow-2xl flex flex-col justify-between group overflow-hidden relative min-h-[500px]">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-30 transition-opacity">
                <MessageSquare size={120} className="text-[#C8F064]" />
            </div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-[#C8F064] rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-[#C8F064]/20">
                    <Zap size={28} className="text-[#162C25] fill-[#162C25]" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-none">
                    Need a <br /><span className="text-[#C8F064]">Human?</span>
                </h3>
                <p className="text-xl text-white/50 font-medium leading-relaxed max-w-xs">
                    Our engineering support team is available 24/7 for technical deep-dives.
                </p>
            </div>
            
            <button className="relative z-10 w-full bg-white/5 border border-white/10 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#C8F064] hover:text-[#162C25] transition-all duration-500">
                Open Support Ticket
            </button>
          </div>

          {/* RIGHT BENTO: THE ACCORDION STACK */}
          <div className="lg:col-span-7 space-y-6">
            {faqData.map((item, i) => (
              <div 
                key={i} 
                className={`faq-bento-item rounded-[3rem] border transition-all duration-700 cursor-pointer ${
                  openIndex === i ? "bg-white border-transparent shadow-[0_40px_80px_-20px_rgba(22,44,37,0.08)]" : "bg-white/40 border-[#162C25]/5 hover:bg-white"
                }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between p-10 text-left">
                  <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-500 ${openIndex === i ? "text-[#162C25]" : "text-[#162C25]/40"}`}>
                    {item.q}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${openIndex === i ? "bg-[#162C25] text-[#C8F064] rotate-180" : "bg-[#F2F9F1] text-[#162C25]"}`}>
                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-10 pb-10 text-lg md:text-xl text-[#162C25]/60 font-medium leading-relaxed max-w-2xl">
                        {item.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="faq-bento-item mt-20 text-center">
            <p className="text-sm font-black text-[#162C25]/30 uppercase tracking-[0.3em]">Still Have Questions?</p>
            <div className="mt-6 flex justify-center gap-4">
                <button className="px-8 py-4 bg-[#162C25] text-[#C8F064] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Email Sales
                </button>
                <button className="px-8 py-4 bg-white border border-[#162C25]/5 text-[#162C25] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#162C25] hover:text-white transition-all">
                    Live Chat
                </button>
            </div>
        </div>

      </div>
    </section>
  );
}