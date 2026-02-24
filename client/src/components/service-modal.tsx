import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ServiceModalProps {
  serviceType: string;
  isOpen: boolean;
  onClose: () => void;
}

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length < 2) return `+7 (${digits.slice(1)}`;
  if (digits.length < 5) return `+7 (${digits.slice(1)}`;
  if (digits.length < 8) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length < 10) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
};

export function ServiceModal({ serviceType, isOpen, onClose }: ServiceModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      toast({
        title: "Некорректный телефон",
        description: "Пожалуйста, введите все 11 цифр номера.",
        variant: "destructive",
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Некорректный Email",
        description: "Пожалуйста, введите корректный адрес электронной почты.",
        variant: "destructive",
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Заполните имя",
        description: "Укажите ваше имя для связи.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // --- TELEGRAM NOTIFICATION START ---
      const nameSafe = encodeURIComponent(name);
      const phoneSafe = encodeURIComponent(phone);
      const emailSafe = encodeURIComponent(email);
      const serviceSafe = encodeURIComponent(serviceType);
      
      const msgText = `🔥 ЛИД С ГЛАВНОЙ!%0A%0A👤 Имя: ${nameSafe}%0A📞 Тел: ${phoneSafe}%0A📧 Email: ${emailSafe}%0A🎯 Интерес: ${serviceSafe}`;
      
      const token = '8405875788:AAFIj7AOwb9H-xUr-a90vVd500nHgKh9SaI';
      const chatId = '362845594';
      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${msgText}`;
      new Image().src = url;
      // --- TELEGRAM NOTIFICATION END ---

      if (typeof window !== 'undefined' && (window as any).ym) {
        // @ts-ignore
        window.ym(106978141, 'reachGoal', 'form_submit');
      }
      
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      
      onClose();
      setEmail("");
      setName("");
      setPhone("");
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setEmail("");
      setName("");
      setPhone("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Заявка: {serviceType}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ваше имя</Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="service-name-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 000-00-00"
              value={phone}
              onChange={(e) => {
                const val = e.target.value;
                setPhone(val.length < phone.length ? val : formatPhoneNumber(val));
              }}
              maxLength={18}
              required
              data-testid="service-phone-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email для связи</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="service-email-input"
            />
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <i className="fas fa-handshake mr-2"></i>
              Оставьте контакты и мы свяжемся с вами для обсуждения условий.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              data-testid="service-cancel-button"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              data-testid="service-submit-button"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Отправляем...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Обсудить условия
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
