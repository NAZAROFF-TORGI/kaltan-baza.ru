import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quizFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email").optional().or(z.literal("")),
});

type QuizFormData = z.infer<typeof quizFormSchema>;

interface QuizAnswer {
  step: number;
  question: string;
  answer: string;
}

export function QuizSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: QuizFormData) => {
      return apiRequest("POST", "/api/leads", {
        ...data,
        type: "quiz",
        quizAnswers: quizAnswers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Спасибо за заявку!",
        description: "Мы свяжемся с вами в ближайшее время с персональным предложением.",
      });
      // Reset quiz
      setCurrentStep(0);
      setQuizAnswers([]);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами по телефону.",
        variant: "destructive",
      });
    },
  });

  const quizSteps = [
    {
      question: "Для какого типа производства вы ищете помещение?",
      options: [
        { value: "manufacturing", label: "Производство", description: "Изготовление товаров", icon: "fas fa-cogs" },
        { value: "warehouse", label: "Склад", description: "Хранение товаров", icon: "fas fa-boxes" },
        { value: "logistics", label: "Логистика", description: "Транспортный узел", icon: "fas fa-truck" },
        { value: "service", label: "Автосервис", description: "Ремонт техники", icon: "fas fa-wrench" },
      ]
    },
    {
      question: "Какая площадь вам необходима в первую очередь?",
      options: [
        { value: "small", label: "До 500 м²", description: "Малый бизнес", icon: "" },
        { value: "medium", label: "500-1000 м²", description: "Средний бизнес", icon: "" },
        { value: "large", label: "1000+ м²", description: "Крупное производство", icon: "" },
        { value: "all", label: "Вся площадь", description: "1300 м² целиком", icon: "" },
      ]
    },
    {
      question: "Когда планируете запуск?",
      options: [
        { value: "immediate", label: "Немедленно", description: "В течение месяца", icon: "" },
        { value: "soon", label: "В ближайшие 3 месяца", description: "Подготовка к запуску", icon: "" },
        { value: "planning", label: "Планирую в 2024", description: "Изучаю варианты", icon: "" },
        { value: "future", label: "Долгосрочные планы", description: "Инвестиционный проект", icon: "" },
      ]
    },
  ];

  const handleOptionSelect = (value: string, label: string) => {
    const newAnswer: QuizAnswer = {
      step: currentStep,
      question: quizSteps[currentStep].question,
      answer: label
    };
    
    setQuizAnswers(prev => [...prev, newAnswer]);
    
    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500);
    } else {
      setCurrentStep(3); // Move to final form step
    }
  };

  const onSubmit = (data: QuizFormData) => {
    submitQuizMutation.mutate(data);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground" data-testid="quiz-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="quiz-title">
            Подберем лучшее коммерческое предложение
          </h2>
          <p className="text-primary-foreground/80 text-lg" data-testid="quiz-subtitle">
            для вашего бизнеса за 60 секунд
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-8 text-foreground">
          <div id="quiz-container" data-testid="quiz-container">
            {/* Quiz Steps */}
            {currentStep < quizSteps.length && (
              <div className="quiz-step active" data-testid={`quiz-step-${currentStep}`}>
                <h3 className="text-xl font-semibold mb-6" data-testid="quiz-question">
                  {quizSteps[currentStep].question}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quizSteps[currentStep].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="quiz-option p-4 h-auto border-2 border-border hover:border-primary transition-colors text-left justify-start"
                      onClick={() => handleOptionSelect(option.value, option.label)}
                      data-testid={`quiz-option-${option.value}`}
                    >
                      <div className="flex flex-col items-start w-full">
                        {option.icon && <i className={`${option.icon} text-primary text-xl mb-2`}></i>}
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Final Form Step */}
            {currentStep === 3 && (
              <div className="quiz-step active" data-testid="quiz-final-step">
                <div className="text-center mb-6">
                  <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2" data-testid="quiz-success-title">Отлично!</h3>
                  <p className="text-muted-foreground" data-testid="quiz-success-description">
                    Оставьте ваш телефон, и мы вышлем персональное предложение с расчетом окупаемости и вариантами использования объекта
                  </p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="quiz-form">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Ваше имя" 
                              {...field} 
                              data-testid="quiz-input-name"
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
                              placeholder="+7 (___) ___-__-__" 
                              {...field} 
                              data-testid="quiz-input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Email (необязательно)" 
                              {...field} 
                              data-testid="quiz-input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-accent text-accent-foreground py-3 hover:bg-accent/90"
                      disabled={submitQuizMutation.isPending}
                      data-testid="quiz-submit-button"
                    >
                      {submitQuizMutation.isPending ? "Отправка..." : "Получить персональное предложение"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
          
          {/* Quiz Progress */}
          <div className="flex justify-center mt-8" data-testid="quiz-progress">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                  data-testid={`quiz-progress-${step}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
