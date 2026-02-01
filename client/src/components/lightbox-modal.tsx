import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LightboxModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

export function LightboxModal({ isOpen, imageSrc, imageAlt, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="lightbox-modal"
    >
      <div className="max-w-4xl max-h-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
          onClick={onClose}
          data-testid="lightbox-close-button"
        >
          <i className="fas fa-times"></i>
        </Button>
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="lightbox-image max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
          data-testid="lightbox-image"
        />
      </div>
    </div>
  );
}
