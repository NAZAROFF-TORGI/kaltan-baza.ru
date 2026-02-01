import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Импорт изображений
import beforeImage from '@assets/interior-01.jpg';
import productionImage from '@assets/generated_images/Wide_workshop_with_narrow_windows_172b4e8f.png';
import equipmentImage from '@assets/generated_images/Maximum_equipment_storage_potential_0d740492.png';

interface BeforeAfterSliderProps {
  className?: string;
}

export function BeforeAfterSlider({ className }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // Позиция слайдера в процентах
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<'production' | 'equipment'>('production');
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Данные для вариантов
  const variants = {
    production: {
      image: productionImage,
      title: "ПРОИЗВОДСТВО",
      subtitle: "Современное производство",
      features: [
        "CNC станки и оборудование",
        "Автоматизированные линии",
        "LED-освещение",
        "Организованные зоны",
        "Система вентиляции"
      ]
    },
    equipment: {
      image: equipmentImage,
      title: "СПЕЦТЕХНИКА",
      subtitle: "Хранение и обслуживание",
      features: [
        "Десятки единиц спецтехники",
        "Экскаваторы, бульдозеры, краны",
        "Автопарк и погрузчики", 
        "Максимальная вместимость",
        "Сервисные и ремонтные зоны"
      ]
    }
  };

  const currentAfterData = variants[currentVariant];

  // Автопроигрывание для демонстрации
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoplay) {
      let cycles = 0;
      interval = setInterval(() => {
        setSliderPosition(prev => {
          if (prev >= 90) {
            cycles++;
            if (cycles % 2 === 0) {
              // Переключаем вариант каждые 2 цикла
              setCurrentVariant(current => current === 'production' ? 'equipment' : 'production');
            }
            return 10;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoplay(false);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoplay(false);
    updateSliderPositionTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updateSliderPositionTouch(e);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const updateSliderPositionTouch = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const resetToMiddle = () => {
    setSliderPosition(50);
    setIsAutoplay(false);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  // Данные для отображения
  const beforeData = {
    title: "БЫЛО",
    subtitle: "Текущее состояние",
    features: [
      "Пустое пространство 1300 м²",
      "Высота потолков 9 м",
      "Металлические конструкции",
      "Узкие окна",
      "Кран-балки 3-5 тонн"
    ]
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 ${className}`} data-testid="before-after-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="slider-title">
            Визуализация потенциала
          </h2>
          <p className="text-muted-foreground text-lg mb-6" data-testid="slider-subtitle">
            Перетащите ползунок, чтобы увидеть преобразование пространства
          </p>
          
          {/* Переключатели вариантов */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button 
              onClick={() => setCurrentVariant('production')}
              variant={currentVariant === 'production' ? "default" : "outline"}
              size="sm"
              data-testid="production-variant-button"
            >
              <i className="fas fa-cogs mr-2"></i>
              Производство
            </Button>
            <Button 
              onClick={() => setCurrentVariant('equipment')}
              variant={currentVariant === 'equipment' ? "default" : "outline"}
              size="sm"
              data-testid="equipment-variant-button"
            >
              <i className="fas fa-truck mr-2"></i>
              Спецтехника
            </Button>
          </div>
          
          {/* Кнопки управления */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={resetToMiddle}
              variant="outline"
              size="sm"
              data-testid="reset-button"
            >
              <i className="fas fa-undo mr-2"></i>
              Сбросить
            </Button>
            <Button 
              onClick={toggleAutoplay}
              variant={isAutoplay ? "default" : "outline"}
              size="sm"
              data-testid="autoplay-button"
            >
              <i className={`fas ${isAutoplay ? 'fa-pause' : 'fa-play'} mr-2`}></i>
              {isAutoplay ? 'Пауза' : 'Автопоказ'}
            </Button>
          </div>
        </div>

        {/* Основной слайдер */}
        <div className="relative max-w-5xl mx-auto">
          <div 
            ref={containerRef}
            className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-testid="slider-container"
          >
            {/* Изображение "После" (полный фон) */}
            <div className="absolute inset-0">
              <img 
                src={currentAfterData.image} 
                alt="Визуализация современного производства в цехе Калтан"
                className="w-full h-full object-cover"
                data-testid="after-image"
              />
              
              {/* Overlay для части "После" */}
              <div className="absolute top-4 right-4 bg-green-600/90 text-white px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold">{currentAfterData.title}</div>
                <div className="text-xs opacity-90">{currentAfterData.subtitle}</div>
              </div>
            </div>

            {/* Изображение "До" (с маской) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img 
                src={beforeImage} 
                alt="Интерьер цеха с кран-балкой 3-5 тонн и высотой потолков 9м"
                className="w-full h-full object-cover"
                data-testid="before-image"
              />
              
              {/* Overlay для части "До" */}
              <div className="absolute top-4 left-4 bg-orange-600/90 text-white px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold">{beforeData.title}</div>
                <div className="text-xs opacity-90">{beforeData.subtitle}</div>
              </div>
            </div>

            {/* Вертикальная линия слайдера */}
            <div 
              ref={sliderRef}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 transition-all duration-75"
              style={{ left: `${sliderPosition}%` }}
              data-testid="slider-line"
            >
              {/* Ручка слайдера */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform">
                <div className="flex space-x-1">
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                  <div className="w-0.5 h-4 bg-gray-400"></div>
                </div>
              </div>
            </div>

            {/* Индикатор процентов */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-mono">
              {Math.round(100 - sliderPosition)}% / {Math.round(sliderPosition)}%
            </div>
          </div>

          {/* Характеристики под слайдером */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Было */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center justify-center md:justify-start">
                <span className="w-4 h-4 bg-orange-600 rounded-full mr-2"></span>
                БЫЛО: Текущее состояние
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {beforeData.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center md:justify-start">
                    <i className="fas fa-circle text-orange-600 text-xs mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Станет */}
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center justify-center md:justify-end">
                СТАНЕТ: {currentAfterData.subtitle}
                <span className="w-4 h-4 bg-green-600 rounded-full ml-2"></span>
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {currentAfterData.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center md:justify-end">
                    <i className="fas fa-circle text-green-600 text-xs mr-2 md:order-2 md:ml-2 md:mr-0"></i>
                    <span className="md:order-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Инструкция для пользователей */}
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <i className="fas fa-hand-pointer mr-2"></i>
              Выберите вариант использования выше, затем перетащите ползунок, чтобы сравнить текущее состояние и потенциал объекта
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}