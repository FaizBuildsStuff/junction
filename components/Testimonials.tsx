"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { Star, Quote, PlayCircle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const reviews = [
  { name: "Christy H.", role: "CEO at Warby Parker", text: "Junction changed how we view infra costs. The automated reports are a lifesaver for our finance team." },
  { name: "Chris C.", role: "Founder at Xero", text: "Intuitive, fast, and powerful. It's the first tool that actually makes expense tracking feel modern." },
  { name: "Enrique C.", role: "VP at Wealthfront", text: "The real-time insights allowed us to cut unnecessary cloud spend by 22% in the first month." },
  { name: "Adam Milne", role: "CTO at Switch Group", text: "Seamless integration. Junction is now a core part of our engineering workflow." },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-48 bg-[#F2F9F1] px-4 sm:px-6 lg:px-20 overflow-hidden relative font-satoshi">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C8F064]/15 blur-[80px] md:blur-[140px] rounded-full -z-10" />
      
      <div className="max-w-[1440px] mx-auto">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="w-full lg:max-w-4xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
               <div className="w-12 md:w-16 h-[2px] bg-[#162C25]" />
               <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#162C25]/40">Social Proof</span>
            </div>
            {/* Fluid Heading: Scales with screen width to prevent overflow */}
            <h2 className="text-[12vw] sm:text-7xl md:text-[110px] font-black tracking-[-0.06em] text-[#162C25] leading-[0.9] md:leading-[0.85]">
              Real Trust. <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162C25] to-[#5E6D68]">Real Results.</span>
            </h2>
          </div>
          <button className="group flex items-center gap-4 md:gap-6 bg-white border border-black/5 p-2 md:p-3 pr-6 md:pr-10 rounded-full shadow-xl hover:bg-[#162C25] hover:text-white transition-all duration-500 transform hover:-translate-y-1">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#162C25] rounded-full flex items-center justify-center group-hover:bg-[#C8F064]">
                <ChevronRight size={20} className="text-[#C8F064] group-hover:text-[#162C25] transition-transform group-hover:translate-x-1" />
            </div>
            <span className="text-xs md:text-sm font-black uppercase tracking-widest">Global Reviews</span>
          </button>
        </div>

        {/* Bento Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="testimonial-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          
          <div className="flex flex-col gap-6 md:gap-8">
            <TestimonialCard data={reviews[0]} />
            <TestimonialCard data={reviews[2]} />
          </div>

          {/* Video Anchor: Responsive height */}
          <div className="relative group min-h-[450px] md:h-auto lg:h-full">
            <div className="h-full bg-[#162C25] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop')] bg-cover grayscale" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#162C25] via-[#162C25]/40 to-transparent" />
               
               <div className="relative z-10">
                 <div className="bg-[#C8F064] w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-10 shadow-2xl shadow-[#C8F064]/20">
                    <Quote size={24} className="text-[#162C25] fill-[#162C25]" />
                 </div>
                 <h3 className="text-white text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter">
                    "Finally, a tool built for the modern CTO."
                 </h3>
               </div>
               
               <div className="relative z-10 flex flex-col items-center">
                  <PlayCircle size={80} className="text-[#C8F064] cursor-pointer hover:scale-110 transition-transform duration-300 mb-4" />
                  <p className="text-white font-black text-xl md:text-2xl tracking-tighter">Peter Lucious</p>
                  <p className="text-[#C8F064] text-[10px] font-black tracking-[0.4em] uppercase opacity-60">VP Engineering • Stripe</p>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <TestimonialCard data={reviews[1]} />
            <TestimonialCard data={reviews[3]} />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ data }: { data: any }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only apply tilt on desktop for better mobile UX
    if (!cardRef.current || window.innerWidth < 768) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(cardRef.current, {
      rotationY: x * 8,
      rotationX: -y * 8,
      transformPerspective: 1200,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.6 });
  };

  return (
    <Card 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border-none shadow-[0_20px_40px_rgba(22,44,37,0.03)] hover:shadow-[0_40px_90px_rgba(200,240,100,0.12)] transition-all duration-500 group relative flex flex-col justify-between"
    >
      <div>
        <div className="flex gap-1.5 mb-8 md:mb-10">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#C8F064] text-[#C8F064]" />
          ))}
        </div>
        <p className="text-[#162C25] font-bold text-lg md:text-2xl leading-snug tracking-tight mb-12 md:mb-16 italic">
          "{data.text}"
        </p>
      </div>
      <div className="flex items-center gap-4 md:gap-5 mt-auto">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-[#F2F9F1] flex items-center justify-center font-black text-xl md:text-2xl text-[#162C25] border border-black/5 group-hover:bg-[#C8F064] transition-colors duration-500">
          {data.name[0]}
        </div>
        <div>
          <h4 className="font-black text-sm md:text-lg text-[#162C25]">{data.name}</h4>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">{data.role}</p>
        </div>
      </div>
    </Card>
  );
}