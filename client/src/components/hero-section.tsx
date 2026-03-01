import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import heroPoster from '@assets/exterior-01-mobile.jpg';

interface HeroSectionProps {
  onCtaClick: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return true;
  });
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isMobile]);

  const scrollToSpecs = () => {
    const element = document.getElementById('specs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 bg-slate-900" />
      
      {isMobile && (
        <img
          src={heroPoster}
          alt="Промышленный объект Калтан"
          className="absolute inset-0 w-full h-full object-cover z-[5]"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
      
      {!isMobile && (
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hero-video z-[5]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          data-testid="hero-video"
        >
          <source src="/attached_assets/hero-video.mp4" type="video/mp4" />
        </video>
      )}
      
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in" data-testid="hero-title">
            Автономный промышленный объект<br />
            <span className="text-accent">1300 м²</span> на участке 26 соток
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-200 animate-fade-in" data-testid="hero-subtitle">
            Своя скважина и котельная. Запускайте производство, склад, гараж без промедлений.
          </p>
         
          <div className="flex flex-col w-full md:flex-row md:w-auto gap-4 justify-center animate-fade-in">
            <Button 
              onClick={onCtaClick}
              size="lg"
              className="w-full md:w-auto whitespace-normal md:whitespace-nowrap h-auto bg-accent text-accent-foreground px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105"
              data-testid="hero-cta-primary"
            >
              <i className="fas fa-calculator mr-2 shrink-0"></i>
              Получить планировки и расчет стоимости
            </Button>
            <Button
              onClick={scrollToSpecs}
              variant="outline"
              size="lg"
              className="w-full md:w-auto whitespace-normal md:whitespace-nowrap h-auto bg-white/20 text-white border-white/30 px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold hover:bg-white/30 transition-all"
              data-testid="hero-cta-secondary"
            >
              <i className="fas fa-info-circle mr-2 shrink-0"></i>
              Подробнее об объекте
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" data-testid="scroll-indicator">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>
  );
}
