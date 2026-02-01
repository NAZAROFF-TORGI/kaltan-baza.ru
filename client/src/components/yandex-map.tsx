import { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  className?: string;
}

export function YandexMap({ className }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy loading - only load map when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setError(true);
      }
    }, 3000);

    // Проверяем доступность Яндекс.Карт API
    if (typeof window !== 'undefined' && (window as any).ymaps) {
      (window as any).ymaps.ready(() => {
        try {
          if (mapRef.current && !mapInstanceRef.current) {
            // Точные координаты для адреса: г. Калтан, ул. Комсомольская, д.8, к.1
            const coordinates = [53.5258, 87.2756]; // широта, долгота для ул. Комсомольская, 8, к.1

            // Создание карты
            mapInstanceRef.current = new (window as any).ymaps.Map(mapRef.current, {
              center: coordinates,
              zoom: 14,
              type: 'yandex#map',
              controls: ['zoomControl', 'typeSelector', 'rulerControl']
            });

            // Добавление маркера с информацией об объекте
            const placemark = new (window as any).ymaps.Placemark(coordinates, {
              balloonContentHeader: '<strong>🏭 Промышленный объект</strong>',
              balloonContentBody: `
                <div style="font-family: Arial, sans-serif; line-height: 1.4;">
                  <p><strong>Производственный цех, склад, гараж</strong></p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>📏 Площадь помещений: <strong>1300 м²</strong></li>
                    <li>🏞️ Земельный участок: <strong>2600 м²</strong></li>
                    <li>⚡ Электричество: <strong>200+ кВт</strong></li>
                    <li>🏗️ Высота потолков: <strong>9 м</strong></li>
                    <li>🏗️ Кран-балки: <strong>3-5 тонн</strong></li>
                    <li>💧 Своя скважина</li>
                    <li>🔥 Автономная котельная</li>
                  </ul>
                </div>
              `,
              balloonContentFooter: '<strong>📍 ул. Комсомольская, 8, К.1<br/>Калтан, Кемеровская область</strong>',
              hintContent: '🏭 Промышленный объект 1300 м² - Кликните для подробностей'
            }, {
              preset: 'islands#redFactoryIcon',
              iconColor: '#ff6b35'
            });

            mapInstanceRef.current.geoObjects.add(placemark);
            setIsLoaded(true);
            clearTimeout(timeoutId);

            // Открываем балун через секунду для привлечения внимания
            setTimeout(() => {
              if (placemark) {
                placemark.balloon.open();
              }
            }, 1500);
          }
        } catch (err) {
          console.error('Ошибка инициализации карты:', err);
          setError(true);
        }
      });
    } else {
      // Если API не загружен, показываем fallback сразу
      setError(true);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoaded, isVisible]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-[500px] flex items-center justify-center border-2 border-blue-200" data-testid="map-fallback">
        <div className="text-center text-blue-800 p-6">
          <i className="fas fa-map-marked-alt text-6xl mb-4 text-blue-600"></i>
          <h3 className="text-xl font-semibold mb-2">Местоположение объекта</h3>
          <div className="space-y-1 text-sm">
            <p><strong>📍 г. Калтан, Кемеровская область</strong></p>
            <p>ул. Комсомольская, 8, корпус 1</p>
            <p className="text-blue-600 mt-2">🗺️ Координаты: 53.5258°N, 87.2756°E</p>
          </div>
          <div className="mt-4 text-xs text-blue-600 bg-blue-200 px-3 py-2 rounded">
            Интерактивная карта временно недоступна
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg h-[500px] flex items-center justify-center border z-10" data-testid="map-loading">
          <div className="text-center text-gray-600">
            <i className="fas fa-spinner fa-spin text-4xl mb-4 text-primary"></i>
            <p className="text-lg font-medium">Загрузка карты...</p>
            <p className="text-sm">Кемеровская обл., ул. Комсомольская, 8, К.1</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className={`w-full h-[500px] rounded-lg border shadow-lg ${className}`}
        data-testid="yandex-map"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
    </div>
  );
}