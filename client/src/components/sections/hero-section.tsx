import React, {
  Component,
  ErrorInfo,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";

// --- 1. КЛАСС-ПЕРЕХВАТЧИК (ЛОКАЛКАТОР ОШИБОК) ---
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorStack: string;
}

class HeroErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "", errorStack: "" };
  }

  static getDerivedStateFromError(error: Error) {
    // Если происходит сбой, меняем состояние, чтобы показать красный экран
    return {
      hasError: true,
      errorMessage: error.toString(),
      errorStack: error.stack || "",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Критический сбой перехвачен:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-red-700 text-white p-6 z-50">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 uppercase text-center">
            Сбой Мобильной Версии
          </h1>
          <p className="text-lg mb-4 font-mono text-center bg-black/30 p-2 rounded">
            {this.state.errorMessage}
          </p>
          <pre className="text-xs bg-black/80 p-4 rounded w-full overflow-x-auto text-left opacity-90">
            {this.state.errorStack}
          </pre>
          <p className="mt-6 text-sm text-center font-bold animate-pulse">
            Сделайте скриншот этого экрана и отправьте его мне!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 2. НАШ КОНТЕНТ (Универсальная версия с видео) ---
interface HeroSectionProps {
  onCtaClick: () => void;
}

function HeroContent({ onCtaClick }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Автоплей заблокирован:", e));
    }
  }, []);

  const scrollToSpecs = () => {
    document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-slate-900"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/attached_assets/exterior-01.jpg"
        >
          <source src="/attached_assets/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 flex items-center justify-center min-h-[100dvh] w-full">
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
    </section>
  );
}

// --- 3. ЭКСПОРТ СЕКЦИИ, ЗАВЕРНУТОЙ В ЛОВУШКУ ---
export function HeroSection(props: HeroSectionProps) {
  return (
    <HeroErrorBoundary>
      <HeroContent {...props} />
    </HeroErrorBoundary>
  );
}
