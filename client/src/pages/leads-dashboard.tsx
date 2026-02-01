import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'hot';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  createdAt: string;
  lastActivity: string;
  analysis?: {
    readinessLevel: string;
    recommendedActions: string[];
    riskFactors: string[];
    strengths: string[];
  };
}

export function LeadsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leads with scoring
  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ['/api/leads/scored'],
    queryFn: async () => {
      const response = await fetch('/api/leads/scored');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      return response.json();
    }
  });

  const leads = Array.isArray(leadsResponse) ? leadsResponse : [];
  

  // Update lead status
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      return apiRequest("PATCH", `/api/leads/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads/scored'] });
      toast({
        title: "Лид обновлен",
        description: "Статус лида успешно изменен.",
      });
    },
  });

  // Export leads to CSV
  const exportMutation = useMutation({
    mutationFn: async (format: 'csv' | 'excel') => {
      return apiRequest("GET", `/api/leads/export?format=${format}`);
    },
    onSuccess: (response: any) => {
      // Download file
      const blob = new Blob([response.data], { 
        type: response.mimeType 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Экспорт завершен",
        description: "Файл сохранен в папку Загрузки.",
      });
    },
  });

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = searchTerm === "" || 
                         lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         lead.phone.includes(searchTerm);
    
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-purple-500 text-white';
      case 'qualified': return 'bg-green-500 text-white';
      case 'proposal': return 'bg-indigo-500 text-white';
      case 'closed': return 'bg-emerald-500 text-white';
      case 'lost': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getReadinessIcon = (level: string) => {
    switch (level) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💤';
      default: return '❓';
    }
  };

  // Calculate statistics
  const stats = {
    total: leads.length,
    hot: leads.filter((l: Lead) => l.priority === 'hot').length,
    high: leads.filter((l: Lead) => l.priority === 'high').length,
    new: leads.filter((l: Lead) => l.status === 'new').length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum: number, l: Lead) => sum + l.score, 0) / leads.length) : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-lg text-gray-600">Загрузка панели лидов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Панель управления лидами
          </h1>
          <p className="text-gray-600">
            CRM система с интеллектуальной оценкой и приоритизацией лидов
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Всего лидов</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.hot}</div>
              <div className="text-sm text-gray-600">Горячие</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
              <div className="text-sm text-gray-600">Высокий приоритет</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.new}</div>
              <div className="text-sm text-gray-600">Новые</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.avgScore}</div>
              <div className="text-sm text-gray-600">Средний балл</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Поиск по имени, email или телефону..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  data-testid="leads-search"
                />
              </div>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все приоритеты</SelectItem>
                  <SelectItem value="hot">🔥 Горячие</SelectItem>
                  <SelectItem value="high">🟠 Высокий</SelectItem>
                  <SelectItem value="medium">🟡 Средний</SelectItem>
                  <SelectItem value="low">⚪ Низкий</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="contacted">Контакт установлен</SelectItem>
                  <SelectItem value="qualified">Квалифицированы</SelectItem>
                  <SelectItem value="proposal">Предложение</SelectItem>
                  <SelectItem value="closed">Закрыты</SelectItem>
                  <SelectItem value="lost">Потеряны</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">По баллам ↓</SelectItem>
                  <SelectItem value="date">По дате ↓</SelectItem>
                  <SelectItem value="activity">По активности ↓</SelectItem>
                  <SelectItem value="name">По имени ↑</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  onClick={() => exportMutation.mutate('csv')}
                  variant="outline"
                  disabled={exportMutation.isPending}
                  data-testid="export-csv"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  CSV
                </Button>
                <Button
                  onClick={() => exportMutation.mutate('excel')}
                  variant="outline"
                  disabled={exportMutation.isPending}
                  data-testid="export-excel"
                >
                  <i className="fas fa-file-excel mr-2"></i>
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead: Lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {lead.name}
                      </h3>
                      <Badge className={getPriorityColor(lead.priority)}>
                        {lead.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <div className="text-2xl font-bold text-blue-600">
                        {lead.score} баллов
                      </div>
                      {lead.analysis && (
                        <span className="text-lg" title={`Готовность: ${lead.analysis.readinessLevel}`}>
                          {getReadinessIcon(lead.analysis.readinessLevel)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Контакты</div>
                        <div className="font-medium">
                          <div>📞 {lead.phone}</div>
                          <div>📧 {lead.email}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Тип лида</div>
                        <div className="font-medium">{lead.type}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Создан</div>
                        <div className="font-medium">
                          {new Date(lead.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">Сообщение</div>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                          {lead.message}
                        </div>
                      </div>
                    )}

                    {lead.analysis && (
                      <Tabs defaultValue="actions" className="w-full">
                        <TabsList>
                          <TabsTrigger value="actions">Рекомендации</TabsTrigger>
                          <TabsTrigger value="analysis">Анализ</TabsTrigger>
                        </TabsList>
                        <TabsContent value="actions" className="mt-3">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">
                              Рекомендуемые действия:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                              {lead.analysis.recommendedActions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="analysis" className="mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lead.analysis.strengths.length > 0 && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Сильные стороны:</h4>
                                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                  {lead.analysis.strengths.map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {lead.analysis.riskFactors.length > 0 && (
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">Факторы риска:</h4>
                                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                  {lead.analysis.riskFactors.map((risk, index) => (
                                    <li key={index}>{risk}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateLeadMutation.mutate({ 
                        id: lead.id, 
                        updates: { status: value as any } 
                      })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Новый</SelectItem>
                        <SelectItem value="contacted">Контакт установлен</SelectItem>
                        <SelectItem value="qualified">Квалифицирован</SelectItem>
                        <SelectItem value="proposal">Предложение</SelectItem>
                        <SelectItem value="closed">Закрыт</SelectItem>
                        <SelectItem value="lost">Потерян</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${lead.phone}`}>
                          <i className="fas fa-phone mr-1"></i>
                          Позвонить
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${lead.email}`}>
                          <i className="fas fa-envelope mr-1"></i>
                          Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Лиды не найдены
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}