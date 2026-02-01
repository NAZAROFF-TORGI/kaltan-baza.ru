import type { Lead, Analytics } from "@shared/schema";

export interface ScoringCriteria {
  leadType: { [key: string]: number };
  hasQuizAnswers: number;
  hasPhone: number;
  hasEmail: number;
  businessTypeMatch: number;
  engagementActions: { [key: string]: number };
  timeDecay: {
    fresh: number; // 0-24 hours
    recent: number; // 1-7 days  
    old: number; // 7+ days
  };
}

export const DEFAULT_SCORING_CRITERIA: ScoringCriteria = {
  leadType: {
    'quiz': 100, // Высший приоритет - прошел квиз
    'contact': 80, // Средний - заполнил контактную форму
    'document_download': 60, // Базовый - скачал документы
  },
  hasQuizAnswers: 50, // Бонус за ответы в квизе
  hasPhone: 30, // Бонус за указание телефона
  hasEmail: 20, // Бонус за указание email
  businessTypeMatch: 40, // Бонус за соответствие целевому бизнесу
  engagementActions: {
    'phone_click': 25, // Кликнул по телефону
    'whatsapp_click': 20, // Кликнул по WhatsApp
    'telegram_click': 15, // Кликнул по Telegram
    'download': 10, // Скачал документ
    'form_submit': 30, // Отправил форму
    'quiz_complete': 50, // Завершил квиз
  },
  timeDecay: {
    fresh: 1.0, // 0-24 часа - полные баллы
    recent: 0.8, // 1-7 дней - 80% баллов
    old: 0.5, // 7+ дней - 50% баллов
  }
};

export class LeadScoringService {
  private criteria: ScoringCriteria;

  constructor(criteria: ScoringCriteria = DEFAULT_SCORING_CRITERIA) {
    this.criteria = criteria;
  }

  /**
   * Рассчитывает общий балл лида на основе его данных и активности
   */
  calculateLeadScore(lead: Lead, analytics: Analytics[] = []): number {
    let score = 0;

    // Базовый балл по типу лида
    score += this.criteria.leadType[lead.type] || 0;

    // Бонусы за заполненные поля
    if (lead.quizAnswers) {
      score += this.criteria.hasQuizAnswers;
    }
    if (lead.phone && lead.phone.length > 0) {
      score += this.criteria.hasPhone;
    }
    if (lead.email && lead.email.length > 0) {
      score += this.criteria.hasEmail;
    }

    // Анализ ответов квиза для определения соответствия
    if (lead.quizAnswers && typeof lead.quizAnswers === 'object') {
      const answers = lead.quizAnswers as any;
      
      // Бонус за промышленный тип деятельности
      if (answers.businessType === 'production' || 
          answers.businessType === 'manufacturing' ||
          answers.currentSpace === 'warehouse') {
        score += this.criteria.businessTypeMatch;
      }
    }

    // Учет активности пользователя
    const userAnalytics = analytics.filter(a => {
      // Привязываем активность к лиду по IP или временным меткам
      return this.isRelatedToLead(a, lead);
    });

    for (const activity of userAnalytics) {
      const activityScore = this.criteria.engagementActions[activity.eventType] || 0;
      score += activityScore;
    }

    // Применяем временной коэффициент
    const timeDecay = this.calculateTimeDecay(lead.createdAt);
    score = Math.round(score * timeDecay);

    return Math.max(score, 0);
  }

  /**
   * Определяет приоритет лида на основе балла
   */
  calculatePriority(score: number): 'low' | 'medium' | 'high' | 'hot' {
    if (score >= 200) return 'hot';
    if (score >= 150) return 'high';
    if (score >= 100) return 'medium';
    return 'low';
  }

  /**
   * Анализирует качество лида
   */
  analyzeLeadQuality(lead: Lead, analytics: Analytics[] = []) {
    const score = this.calculateLeadScore(lead, analytics);
    const priority = this.calculatePriority(score);
    
    const analysis = {
      score,
      priority,
      readinessLevel: this.assessReadiness(lead, score),
      recommendedActions: this.getRecommendedActions(lead, priority),
      riskFactors: this.identifyRiskFactors(lead),
      strengths: this.identifyStrengths(lead)
    };

    return analysis;
  }

  /**
   * Оценивает готовность лида к покупке
   */
  private assessReadiness(lead: Lead, score: number): 'low' | 'medium' | 'high' {
    if (score >= 180 && lead.type === 'quiz') return 'high';
    if (score >= 120 && (lead.phone && lead.email)) return 'medium';
    return 'low';
  }

  /**
   * Предлагает рекомендуемые действия
   */
  private getRecommendedActions(lead: Lead, priority: string): string[] {
    const actions: string[] = [];

    switch (priority) {
      case 'hot':
        actions.push('Немедленный звонок в течение 1 часа');
        actions.push('Предложить встречу на объекте');
        actions.push('Подготовить коммерческое предложение');
        break;
      case 'high':
        actions.push('Связаться в течение 4 часов');
        actions.push('Отправить подробную информацию');
        actions.push('Назначить звонок');
        break;
      case 'medium':
        actions.push('Связаться в течение 24 часов');
        actions.push('Отправить дополнительные материалы');
        break;
      case 'low':
        actions.push('Добавить в воронку email-маркетинга');
        actions.push('Связаться в течение 3 дней');
        break;
    }

    return actions;
  }

  /**
   * Определяет факторы риска
   */
  private identifyRiskFactors(lead: Lead): string[] {
    const risks: string[] = [];

    if (!lead.phone || lead.phone.length === 0) {
      risks.push('Отсутствует номер телефона');
    }
    if (!lead.email || lead.email.length === 0) {
      risks.push('Отсутствует email');
    }
    if (lead.type === 'document_download' && !lead.quizAnswers) {
      risks.push('Низкая вовлеченность - только скачивание');
    }

    return risks;
  }

  /**
   * Определяет сильные стороны лида
   */
  private identifyStrengths(lead: Lead): string[] {
    const strengths: string[] = [];

    if (lead.type === 'quiz') {
      strengths.push('Высокая вовлеченность - прошел квиз');
    }
    if (lead.phone && lead.email) {
      strengths.push('Полные контактные данные');
    }
    if (lead.quizAnswers) {
      strengths.push('Предоставил подробную информацию');
    }

    return strengths;
  }

  /**
   * Рассчитывает временной коэффициент
   */
  private calculateTimeDecay(createdAt: Date | null): number {
    if (!createdAt) return this.criteria.timeDecay.old;

    const now = new Date();
    const hoursDiff = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 24) return this.criteria.timeDecay.fresh;
    if (hoursDiff <= 168) return this.criteria.timeDecay.recent; // 7 days
    return this.criteria.timeDecay.old;
  }

  /**
   * Определяет связана ли активность с лидом
   */
  private isRelatedToLead(analytics: Analytics, lead: Lead): boolean {
    // Упрощенная логика - в реальности нужно более сложное сопоставление
    if (!analytics.createdAt || !lead.createdAt) return false;
    
    const analyticsTime = new Date(analytics.createdAt).getTime();
    const leadTime = new Date(lead.createdAt).getTime();
    
    // Активность в течение 1 часа до/после создания лида считается связанной
    return Math.abs(analyticsTime - leadTime) <= 3600000;
  }
}

export const leadScoringService = new LeadScoringService();