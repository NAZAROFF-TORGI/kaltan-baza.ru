import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DocumentDownloadModal } from "./document-download-modal";

interface GalleryItem {
  src: string;
  alt: string;
  category: string;
}

interface GallerySectionProps {
  onLightboxOpen: (item: GalleryItem) => void;
  onDownloadClick: () => void;
}

export function GallerySection({ onLightboxOpen, onDownloadClick }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const galleryItems: GalleryItem[] = [
    // Экстерьер - новые фотографии
    {
      src: "/attached_assets/exterior-01.jpg",
      alt: "Внешний вид промышленного объекта в Калтане, 1300 м²",
      category: "exterior"
    },
    {
      src: "/attached_assets/exterior-02.jpg",
      alt: "Общий вид промышленного здания с информационным баннером",
      category: "exterior"
    },
    {
      src: "/attached_assets/exterior-03.jpg",
      alt: "Металлические конструкции кран-балки и территория объекта",
      category: "exterior"
    },
    {
      src: "/attached_assets/exterior-04.jpg",
      alt: "Фасад здания с красными воротами и информационным баннером",
      category: "exterior"
    },
    {
      src: "/attached_assets/exterior-05.jpg",
      alt: "Вид объекта с табличкой 'Продажа 1300 м²' в зимний период",
      category: "exterior"
    },
    {
      src: "/attached_assets/exterior-06.jpg",
      alt: "Панорамный вид промышленного комплекса с высоты зимой",
      category: "exterior"
    },
    // Интерьер - новые фотографии
    {
      src: "/attached_assets/interior-01.jpg",
      alt: "Интерьер цеха с кран-балкой 3-5 тонн и высотой потолков 9м",
      category: "interior"
    },
    {
      src: "/attached_assets/interior-02.jpg",
      alt: "Интерьер цеха с автомобилем для демонстрации масштаба помещения",
      category: "interior"
    },
    {
      src: "/attached_assets/interior-03.jpg",
      alt: "Внутренние помещения с большими окнами и естественным освещением",
      category: "interior"
    },
    {
      src: "/attached_assets/interior-04.jpg",
      alt: "Цех с металлическими конструкциями и промышленным оборудованием",
      category: "interior"
    }
  ];

  const filters = [
    { id: 'all', label: 'Все фото', icon: 'fas fa-images' },
    { id: 'exterior', label: 'Экстерьер', icon: 'fas fa-building' },
    { id: 'interior', label: 'Интерьер', icon: 'fas fa-warehouse' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  // Автопроигрывание слайдов
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoplay && filteredItems.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filteredItems.length);
      }, 4000);
    }

    return () => clearInterval(interval);
  }, [isAutoplay, filteredItems.length]);

  // Сброс текущего слайда при смене фильтра
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  return (
    <section id="gallery" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="gallery-title">
            Галерея объекта
          </h2>
          <p className="text-muted-foreground text-lg mb-8" data-testid="gallery-subtitle">
            Профессиональные фотографии промышленного комплекса
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8" data-testid="gallery-filters">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className="px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                data-testid={`filter-${filter.id}`}
              >
                <i className={`${filter.icon} mr-2`}></i>
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Modern Carousel Gallery */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Main Carousel */}
          <div className="relative h-96 md:h-[500px] lg:h-[600px]" ref={carouselRef}>
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-x-0' 
                    : index < currentSlide 
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-0 transform translate-x-full'
                }`}
                data-testid={`carousel-slide-${index}`}
              >
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onLightboxOpen(item)}
                  loading="lazy"
                  decoding="async"
                  data-testid={`carousel-image-${index}`}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {item.category === 'exterior' ? 'Экстерьер объекта' : 'Интерьер помещений'}
                      </h3>
                      <p className="text-sm opacity-90">{item.alt}</p>
                    </div>
                    <Button
                      onClick={() => onLightboxOpen(item)}
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      data-testid={`expand-button-${index}`}
                    >
                      <i className="fas fa-expand"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  data-testid="carousel-prev"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  data-testid="carousel-next"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-mono">
              {currentSlide + 1} / {filteredItems.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {filteredItems.length > 1 && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-center space-x-4">
                {/* Thumbnail Dots */}
                <div className="flex space-x-2">
                  {filteredItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      data-testid={`thumbnail-dot-${index}`}
                    />
                  ))}
                </div>

                {/* Autoplay Toggle */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={toggleAutoplay}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="autoplay-toggle"
                  >
                    <i className={`fas ${isAutoplay ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                    {isAutoplay ? 'Пауза' : 'Авто'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Grid for Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {filteredItems.slice(0, 10).map((item, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                index === currentSlide ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:ring-2 hover:ring-blue-300'
              }`}
              data-testid={`thumbnail-${index}`}
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentSlide ? 'bg-blue-500/20' : 'bg-black/0 hover:bg-black/20'
              }`}></div>
              {index === currentSlide && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-eye text-white text-lg"></i>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DocumentDownloadModal
              documentType="technical-passport"
              documentTitle="техническую документацию"
            >
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
                data-testid="gallery-download-button"
              >
                <i className="fas fa-download mr-2"></i>
                Скачать техдокументацию
              </Button>
            </DocumentDownloadModal>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Нажмите на любое фото для увеличения • Используйте стрелки для навигации • Включите автопоказ для обзора
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}