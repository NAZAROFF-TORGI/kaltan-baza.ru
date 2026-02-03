import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DocumentDownloadModalProps {
  children: ReactNode;
  documentType: string;
  documentTitle: string;
  triggerClassName?: string;
}

export function DocumentDownloadModal({ 
  children, 
  documentType, 
  documentTitle,
  triggerClassName 
}: DocumentDownloadModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Отправляем форму напрямую, без React Query
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFileInfo = (type: string): { path: string; name: string } => {
    switch (type) {
      case "egrn-excerpt":
        return { path: "/attached_assets/egrn.pdf", name: "Выписка_ЕГРН.pdf" };
      case "technical-passport":
        return { path: "/attached_assets/passport.pdf", name: "Техпаспорт.pdf" };
      case "floor-plans":
        return { path: "/attached_assets/passport.pdf", name: "Планировки.pdf" };
      default:
        return { path: "/attached_assets/egrn.pdf", name: "Документ.pdf" };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name || !phone) {
      toast({
        title: "Заполните все поля",
        description: "Укажите ваше имя, телефон и email для получения документов.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const fileInfo = getFileInfo(documentType);
      
      // --- TELEGRAM NOTIFICATION START ---
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      const msgText = `🔥 <b>НОВЫЙ ЛИД!</b>%0A%0A👤 <b>Имя:</b> ${name}%0A📞 <b>Тел:</b> ${phone}%0A📧 <b>Email:</b> ${email}%0A📄 <b>Скачал:</b> ${documentTitle}`;
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "📞 Позвонить", url: `tel:${cleanPhone}` },
            { text: "✉️ Написать", url: `mailto:${email}` }
          ]
        ]
      };
      const keyboardJson = encodeURIComponent(JSON.stringify(keyboard));
      
      fetch(`https://api.telegram.org/bot8405875788:AAFIj7AOwb9H-xUr-a90vVd500nHgKh9SaI/sendMessage?chat_id=362845594&text=${msgText}&parse_mode=HTML&reply_markup=${keyboardJson}`, {
        method: 'POST',
        mode: 'no-cors'
      }).then(() => console.log('Sent to TG')).catch(e => console.error(e));
      // --- TELEGRAM NOTIFICATION END ---
      
      const link = document.createElement('a');
      link.href = fileInfo.path;
      link.download = fileInfo.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Успешно! Скачивание началось",
        description: "Документ сохраняется в папку Загрузки.",
      });
      
      setIsOpen(false);
      setEmail("");
      setName("");
      setPhone("");
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скачать документы. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={triggerClassName}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Скачать {documentTitle}
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
              data-testid="download-name-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 000-00-00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              data-testid="download-phone-input"
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
              data-testid="download-email-input"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Документы будут автоматически скачаны в браузере. Ваши контакты нужны для связи по объекту.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="download-cancel-button"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
              data-testid="download-submit-button"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Отправляем...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Получить документы
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}