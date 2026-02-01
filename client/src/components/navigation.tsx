import { useState } from "react";
import { Button } from "@/components/ui/button";

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
            className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity" 
            data-testid="logo"
            onClick={scrollToContact}
          >
            <img 
              src="/attached_assets/Лого_цех_проз_фон_1769874756739.png" 
              alt="Герб Калтана" 
              className="h-14 w-auto"
            />
            <span className="font-semibold text-xl">Промобъект Калтан</span>
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

          {/* Phone Button */}
          <Button 
            onClick={onPhoneClick}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-testid="nav-phone-button"
          >
            <i className="fas fa-phone mr-2"></i>
            Позвонить
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-button"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
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