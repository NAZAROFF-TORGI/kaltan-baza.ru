import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { KeyMetrics } from "@/components/key-metrics";
import { GallerySection } from "@/components/gallery-section";
import { LocationSection } from "@/components/location-section";
import { TechnicalSpecs } from "@/components/technical-specs";
import { TrustSection } from "@/components/trust-section";
import { QuizSection } from "@/components/quiz-section";
import { ContactSection } from "@/components/contact-section";
import { LightboxModal } from "@/components/lightbox-modal";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import logo from "@/assets/logo.png";

interface GalleryItem {
  src: string;
  alt: string;
  category: string;
}

export default function IndustrialLanding() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const { toast } = useToast();

  const trackAnalytics = useMutation({
    mutationFn: async (data: { eventType: string; data?: any }) => {
      return apiRequest("POST", "/api/analytics", data);
    },
  });

  const downloadDocument = useMutation({
    mutationFn: async (document: string) => {
      return apiRequest("GET", `/api/download/${document}`);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Документ готов к скачиванию",
        description: "Ссылка на скачивание отправлена на ваш email.",
      });
    },
  });

  const handlePhoneClick = () => {
    trackAnalytics.mutate({
      eventType: 'phone_click',
      data: { source: 'header' }
    });

    // Проверяем, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // На мобильных устройствах открываем номер для звонка
      window.open('tel:+79059933595');
    } else {
      // На ПК открываем WhatsApp
      window.open('https://wa.me/79059933595', '_blank');
    }
  };

  const handleWhatsAppClick = () => {
    trackAnalytics.mutate({ eventType: 'whatsapp_click' });
    window.open('https://wa.me/79059933595', '_blank');
  };

  const handleTelegramClick = () => {
    trackAnalytics.mutate({ eventType: 'telegram_click' });
    window.open('https://t.me/nazaroff_auction', '_blank');
  };

  const handleEmailClick = () => {
    trackAnalytics.mutate({ eventType: 'email_click' });
    window.location.href = 'mailto:naz-nv@mail.ru';
  };

  const handleDocumentDownload = (document: string) => {
    trackAnalytics.mutate({
      eventType: 'download',
      data: { document }
    });
    downloadDocument.mutate(document);
  };

  const handleGalleryDownload = () => {
    trackAnalytics.mutate({
      eventType: 'download',
      data: { document: 'all-documents' }
    });
    downloadDocument.mutate('all-documents');
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="industrial-landing">
      <Navigation onPhoneClick={handlePhoneClick} />

      <HeroSection onCtaClick={scrollToContact} />

      <KeyMetrics />

      <GallerySection
        onLightboxOpen={setLightboxItem}
        onDownloadClick={handleGalleryDownload}
      />

      <BeforeAfterSlider />

      <LocationSection />

      <TechnicalSpecs />

      <TrustSection onDocumentDownload={handleDocumentDownload} />

      <QuizSection />

      <ContactSection
        onPhoneClick={handlePhoneClick}
        onWhatsAppClick={handleWhatsAppClick}
        onTelegramClick={handleTelegramClick}
        onEmailClick={handleEmailClick}
      />

      {/* Footer - Professional Golden Standard */}
      <footer className="relative bg-gradient-to-b from-slate-800 to-slate-900" data-testid="footer">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            
            {/* Company Block - 5 columns */}
            <div className="lg:col-span-5">
              <div 
                className="flex items-center space-x-4 mb-6 cursor-pointer group" 
                data-testid="footer-logo"
                onClick={scrollToContact}
              >
                <img 
                  src="/attached_assets/logo-kaltan.png" 
                  alt="Герб Калтан" 
                  className="h-20 w-auto group-hover:scale-105 transition-transform duration-300" 
                />
                <div>
                  <h3 className="text-white font-bold text-2xl tracking-tight">Промобъект Калтан</h3>
                  <p className="text-amber-400 font-medium">Промышленный цех 1228 м²</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                Прямая продажа промышленного объекта от собственника. Без посредников и скрытых комиссий.
              </p>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a 
                  href="https://wa.me/79059933595" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp text-white text-lg"></i>
                </a>
                <a 
                  href="https://t.me/nazaroff_auction" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-700 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Telegram"
                >
                  <i className="fab fa-telegram-plane text-white text-lg"></i>
                </a>
                <a 
                  href="mailto:naz-nv@mail.ru"
                  className="w-10 h-10 bg-slate-700 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Email"
                >
                  <i className="fas fa-envelope text-white text-lg"></i>
                </a>
              </div>
            </div>

            {/* Contacts Block - 3 columns */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-amber-400 mr-3"></span>
                Контакты
              </h4>
              <div className="space-y-4">
                <a 
                  href="tel:+79059933595" 
                  className="flex items-center text-slate-300 hover:text-amber-400 transition-colors group"
                >
                  <i className="fas fa-phone text-amber-400 mr-3 group-hover:scale-110 transition-transform"></i>
                  <span className="font-medium">+7 (905) 993-35-95</span>
                </a>
                <a 
                  href="mailto:naz-nv@mail.ru" 
                  className="flex items-center text-slate-300 hover:text-amber-400 transition-colors group"
                >
                  <i className="fas fa-envelope text-amber-400 mr-3 group-hover:scale-110 transition-transform"></i>
                  <span>naz-nv@mail.ru</span>
                </a>
                <div className="flex items-start text-slate-300">
                  <i className="fas fa-map-marker-alt text-amber-400 mr-3 mt-1"></i>
                  <span>Кемеровская область,<br/>г. Калтан</span>
                </div>
              </div>
            </div>

            {/* Legal Block - 4 columns */}
            <div className="lg:col-span-4">
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                <span className="w-8 h-0.5 bg-amber-400 mr-3"></span>
                Реквизиты
              </h4>
              <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                <p className="text-white font-medium mb-3">ИП Назарова Татьяна Ивановна</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-slate-400">ИНН:</span>
                  <span className="text-slate-200">422206691704</span>
                  <span className="text-slate-400">ОГРНИП:</span>
                  <span className="text-slate-200">323420500100731</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col space-y-2">
                <a 
                  href="/attached_assets/user-agreement.txt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center"
                  data-testid="user-agreement-link"
                >
                  <i className="fas fa-file-alt mr-2 text-xs"></i>
                  Пользовательское соглашение
                </a>
                <a 
                  href="/privacy-policy"
                  className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center"
                  data-testid="privacy-policy-link"
                >
                  <i className="fas fa-shield-alt mr-2 text-xs"></i>
                  Политика конфиденциальности
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-500 text-sm">
                © 2025 ИП Назарова Т.И. Все права защищены.
              </p>
              <p className="text-slate-600 text-xs mt-3 md:mt-0">
                Сайт не является публичной офертой
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxItem}
        imageSrc={lightboxItem?.src || ''}
        imageAlt={lightboxItem?.alt || ''}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}