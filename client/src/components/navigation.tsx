import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoImg from '@assets/logo-kaltan-opt.png';

interface NavigationProps {
  onPhoneClick: () => void;
}

export function Navigation({ onPhoneClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToContact = () => {
    scrollToSection('contact');
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity min-w-0 shrink" 
            data-testid="logo"
            onClick={scrollToContact}
          >
            <img 
              src={logoImg} 
              alt="Герб Калтана" 
              className="h-8 sm:h-14 w-auto shrink-0"
            />
            <span className="font-semibold text-xs sm:text-xl truncate">Промобъект Калтан</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('specs')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-specs"
            >
              Характеристики
            </button>
            <button 
              onClick={() => scrollToSection('gallery')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-gallery"
            >
              Галерея
            </button>
            <button 
              onClick={() => scrollToSection('location')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-location"
            >
              Локация
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-contact"
            >
              Контакты
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button 
              onClick={onPhoneClick}
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-2 sm:px-4"
              data-testid="nav-phone-button"
            >
              <i className="fas fa-phone md:mr-2"></i>
              <span className="hidden md:inline">Позвонить</span>
            </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-button"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('specs')} 
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="mobile-nav-specs"
              >
                Характеристики
              </button>
              <button 
                onClick={() => scrollToSection('gallery')} 
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="mobile-nav-gallery"
              >
                Галерея
              </button>
              <button 
                onClick={() => scrollToSection('location')} 
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="mobile-nav-location"
              >
                Локация
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
                data-testid="mobile-nav-contact"
              >
                Контакты
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}