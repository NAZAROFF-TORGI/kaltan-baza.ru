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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Отправляем форму напрямую, без React Query
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Заполните все поля",
        description: "Укажите ваше имя и email для получения документов.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Отправляем данные через fetch и потом скачиваем файл
      const response = await fetch('/api/documents/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          documentType
        })
      });

      if (response.ok) {
        // Создаем blob из ответа и скачиваем
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document.${documentType === 'floor-plans' ? 'png' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Ошибка скачивания');
      }
      
      // Показываем успешное сообщение
      toast({
        title: "Скачивание началось!",
        description: "Документ сохраняется в папку Загрузки.",
      });
      
      setIsOpen(false);
      setEmail("");
      setName("");
      
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