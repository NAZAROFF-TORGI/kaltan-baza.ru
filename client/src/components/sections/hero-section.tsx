import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import heroPoster from "@/assets/exterior-01-mobile.jpg";

interface HeroSectionProps {
  onCtaClick: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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
      video.play().catch(() => {});
    }
  }, [isMobile]);

  const scrollToSpecs = () => {
    document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-slate-900"
      data-testid="hero-section"
    >
      {/* 1. ФОНОВЫЙ СЛОЙ (Картинка или Видео) - z-0 */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <img
            src={heroPoster}
            alt="Промышленный объект Калтан"
            className="w-full h-full object-cover"
            style={{ imageOrientation: "from-image" }}
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/attached_assets/hero-video.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* 2. СЛОЙ ЗАТЕМНЕНИЯ - z-10 */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* 3. СЛОЙ КОНТЕНТА (Всегда виден) - z-20 */}
      <div className="relative z-20 flex items-center justify-center min-h-screen w-full">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-white w-full">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
            Автономный промышленный объект
            <br />
            <span className="text-accent">1300 м²</span> на участке 26 соток
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-200">
            Своя скважина и котельная. Запускайте производство, склад, гараж без
            промедлений.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
            <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-accent text-accent-foreground px-8 py-4 text-sm md:text-lg font-semibold w-full md:w-auto h-auto whitespace-normal"
            >
              Получить планировки и расчет стоимости
            </Button>
            <Button
              onClick={scrollToSpecs}
              variant="outline"
              size="lg"
              className="bg-white/20 text-white border-white/30 px-8 py-4 text-sm md:text-lg font-semibold w-full md:w-auto h-auto"
            >
              Подробнее об объекте
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>
  );
}
