import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserAgreement } from "@/components/user-agreement";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
  onPhoneClick: () => void;
  onWhatsAppClick: () => void;
  onTelegramClick: () => void;
  onEmailClick: () => void;
}

export function ContactSection({
  onPhoneClick,
  onWhatsAppClick,
  onTelegramClick,
  onEmailClick
}: ContactSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/leads", {
        ...data,
        type: "contact",
        email: "",
        quizAnswers: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Спасибо за заявку!",
        description: "Мы перезвоним вам в течение 15 минут.",
      });
      form.reset();
      setAgreementAccepted(false);
    },
    onError: () => {
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами по телефону.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!agreementAccepted) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с пользовательским соглашением",
        variant: "destructive",
      });
      return;
    }
    submitContactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <img src="/attached_assets/logo-kaltan.png" alt="Логотип Промобъект Калтан" className="h-12 w-auto mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Контакты</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Готовы обсудить детали? Оставьте заявку или свяжитесь с нами удобным способом
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="h-full">
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 rounded-xl h-full flex flex-col" data-testid="contact-form-container">
              <h3 className="text-xl font-bold mb-6" data-testid="contact-form-title">
                Заказать звонок и консультацию эксперта
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col" data-testid="contact-form">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Ваше имя"
                            className="bg-white/20 border-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white focus:border-white"
                            {...field}
                            data-testid="contact-input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Номер телефона"
                            className="bg-white/20 border-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white focus:border-white"
                            {...field}
                            data-testid="contact-input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Вопрос или комментарий"
                            rows={3}
                            className="bg-white/20 border-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white focus:border-white resize-none"
                            {...field}
                            data-testid="contact-input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <UserAgreement
                    checked={agreementAccepted}
                    onCheckedChange={setAgreementAccepted}
                  />

                  <div className="mt-auto pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground py-3 hover:bg-accent/90"
                      disabled={submitContactMutation.isPending || !agreementAccepted}
                      data-testid="contact-submit-button"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      {submitContactMutation.isPending ? "Отправка..." : "Заказать звонок"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4" data-testid="contact-info-title">
                Контактная информация
              </h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start p-4 h-auto hover:border-primary transition-colors group"
                  onClick={onPhoneClick}
                  data-testid="contact-phone-button"
                >
                  <i className="fas fa-phone text-primary text-xl mr-3 group-hover:scale-110 transition-transform"></i>
                  <div className="text-left">
                    <div className="font-medium">Телефон</div>
                    <div className="text-primary">+7 (905) 993-35-95</div>
                    <div className="text-xs text-muted-foreground">
                      {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                        ? 'Нажмите для звонка'
                        : 'Нажмите для WhatsApp'}
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start p-4 h-auto hover:border-primary transition-colors group"
                  onClick={onEmailClick}
                  data-testid="contact-email-button"
                >
                  <i className="fas fa-envelope text-primary text-xl mr-3 group-hover:scale-110 transition-transform"></i>
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-primary">naz-nv@mail.ru</div>
                  </div>
                </Button>

                <div className="flex items-center space-x-3 p-4 border border-border rounded-lg" data-testid="contact-address">
                  <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                  <div>
                    <div className="font-medium">Адрес объекта</div>
                    <div className="text-muted-foreground">
                      Кемеровская обл. (Кузбасс)<br />
                      ул. Комсомольская, 8, К.1
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4" data-testid="messengers-title">
                Мессенджеры
              </h3>
              <div className="flex space-x-4">
                <Button
                  onClick={onWhatsAppClick}
                  className="flex-1 bg-green-500 text-white p-4 hover:bg-green-600 transition-colors h-20"
                  data-testid="contact-whatsapp-button"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <i className="fab fa-whatsapp text-2xl mb-2"></i>
                    <div className="text-sm font-medium">WhatsApp</div>
                  </div>
                </Button>
                <Button
                  onClick={onTelegramClick}
                  className="flex-1 bg-blue-500 text-white p-4 hover:bg-blue-600 transition-colors h-20"
                  data-testid="contact-telegram-button"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <i className="fab fa-telegram text-2xl mb-2"></i>
                    <div className="text-sm font-medium">Telegram</div>
                  </div>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4" data-testid="share-title">
                Поделиться
              </h3>
              <div className="flex flex-wrap gap-3" data-testid="share-buttons">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent('https://kaltan-baza.ru/')}&text=${encodeURIComponent('Продажа промышленного цеха 1300 м² в Калтане. Автономный объект с кран-балками на 26 сотках. Прямая продажа от собственника.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0088cc] hover:bg-[#006699] text-white transition-colors"
                  data-testid="share-telegram"
                  title="Поделиться в Telegram"
                >
                  <i className="fab fa-telegram-plane text-xl"></i>
                </a>
                <a
                  href={`https://vk.com/share.php?url=${encodeURIComponent('https://kaltan-baza.ru/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4a76a8] hover:bg-[#3a5f87] text-white transition-colors"
                  data-testid="share-vk"
                  title="Поделиться ВКонтакте"
                >
                  <i className="fab fa-vk text-xl"></i>
                </a>
                <a
                  href={`https://connect.ok.ru/offer?url=${encodeURIComponent('https://kaltan-baza.ru/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ee8208] hover:bg-[#d97407] text-white transition-colors"
                  data-testid="share-ok"
                  title="Поделиться в Одноклассниках"
                >
                  <i className="fab fa-odnoklassniki text-xl"></i>
                </a>
                <a
                  href="https://tenchat.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2b5278] hover:bg-[#1e3a54] text-white transition-colors"
                  data-testid="share-tenchat"
                  title="TenChat"
                >
                  <i className="fas fa-comment-dots text-xl"></i>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Продажа промышленного цеха 1300 м² в Калтане. Автономный объект с кран-балками на 26 сотках. Прямая продажа от собственника. https://kaltan-baza.ru/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25d366] hover:bg-[#1da851] text-white transition-colors"
                  data-testid="share-whatsapp"
                  title="Поделиться в WhatsApp"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}