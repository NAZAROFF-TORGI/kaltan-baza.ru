import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertAnalyticsSchema } from "@shared/schema";
import { leadScoringService } from "./leadScoringService";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Log analytics event for form submission
      await storage.createAnalytics({
        eventType: 'form_submit',
        data: { leadType: leadData.type },
        userAgent: req.get('User-Agent') || '',
        ip: req.ip || '',
      });

      res.json({ success: true, lead });
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError ? error.issues : 'Invalid data' 
      });
    }
  });

  // Analytics tracking endpoint
  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse({
        ...req.body,
        userAgent: req.get('User-Agent') || '',
        ip: req.ip || '',
      });
      
      const analytics = await storage.createAnalytics(analyticsData);
      res.json({ success: true, analytics });
    } catch (error) {
      console.error('Error creating analytics:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof z.ZodError ? error.issues : 'Invalid data' 
      });
    }
  });

  // Get leads (admin endpoint)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get leads with scoring and analysis
  app.get("/api/leads/scored", async (req, res) => {
    try {
      const { priority, status, sort } = req.query;
      
      let leads = await storage.getLeads();
      const analytics = await storage.getAnalytics();
      
      // Calculate scores and analysis for each lead
      const scoredLeads = leads.map(lead => {
        const score = leadScoringService.calculateLeadScore(lead, analytics);
        const priority = leadScoringService.calculatePriority(score);
        const analysis = leadScoringService.analyzeLeadQuality(lead, analytics);
        
        return {
          ...lead,
          score,
          priority,
          analysis
        };
      });
      
      // Update lead scores in storage
      for (const lead of scoredLeads) {
        await storage.updateLead(lead.id, {
          score: lead.score,
          priority: lead.priority
        });
      }
      
      // Apply filters
      let filteredLeads = scoredLeads;
      if (priority && priority !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
      }
      if (status && status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === status);
      }
      
      // Apply sorting
      switch (sort) {
        case 'score':
          filteredLeads.sort((a, b) => b.score - a.score);
          break;
        case 'date':
          filteredLeads.sort((a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime());
          break;
        case 'activity':
          filteredLeads.sort((a, b) => new Date(b.lastActivity || b.createdAt || Date.now()).getTime() - new Date(a.lastActivity || a.createdAt || Date.now()).getTime());
          break;
        case 'name':
          filteredLeads.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          filteredLeads.sort((a, b) => b.score - a.score);
      }
      
      res.json(filteredLeads);
    } catch (error) {
      console.error('Error fetching scored leads:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Add lastActivity timestamp for status changes
      if (updates.status) {
        updates.lastActivity = new Date();
      }
      
      const updatedLead = await storage.updateLead(id, updates);
      
      // Track status change
      if (updates.status) {
        await storage.createAnalytics({
          eventType: 'status_change',
          data: { leadId: id, newStatus: updates.status },
          userAgent: req.get('User-Agent') || '',
          ip: req.ip || '',
        });
      }
      
      res.json({ success: true, lead: updatedLead });
    } catch (error) {
      console.error('Error updating lead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Export leads
  app.get("/api/leads/export", async (req, res) => {
    try {
      const { format } = req.query;
      const leads = await storage.getLeads();
      const analytics = await storage.getAnalytics();
      
      // Calculate scores for export
      const scoredLeads = leads.map(lead => {
        const score = leadScoringService.calculateLeadScore(lead, analytics);
        const priority = leadScoringService.calculatePriority(score);
        const analysis = leadScoringService.analyzeLeadQuality(lead, analytics);
        
        return {
          'Имя': lead.name,
          'Телефон': lead.phone,
          'Email': lead.email,
          'Тип лида': lead.type,
          'Статус': lead.status || 'new',
          'Приоритет': priority,
          'Балл': score,
          'Сообщение': lead.message || '',
          'Дата создания': new Date(lead.createdAt || Date.now()).toLocaleString('ru-RU'),
          'Последняя активность': new Date(lead.lastActivity || lead.createdAt || Date.now()).toLocaleString('ru-RU'),
          'Готовность к покупке': analysis.readinessLevel
        };
      });
      
      if (format === 'csv') {
        // Generate CSV
        const headers = Object.keys(scoredLeads[0] || {});
        const csvRows = [headers.join(',')];
        
        for (const lead of scoredLeads) {
          const values = headers.map(header => {
            const value = lead[header as keyof typeof lead];
            return `"${String(value).replace(/"/g, '""')}"`;
          });
          csvRows.push(values.join(','));
        }
        
        const csvContent = csvRows.join('\n');
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
        res.send('\uFEFF' + csvContent); // BOM for Excel UTF-8 support
      } else {
        // Return JSON for Excel processing
        res.json({
          data: scoredLeads,
          filename: `leads_${new Date().toISOString().split('T')[0]}.xlsx`,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get analytics (admin endpoint)
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Document download with contact form
  app.post("/api/documents/download", async (req, res) => {
    try {
      const { email, name, documentType } = req.body;
      
      if (!email || !name || !documentType) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email, name and document type are required' 
        });
      }

      // Save lead for contact
      await storage.createLead({
        name,
        email,
        phone: '', // Optional
        message: `Запросил документы: ${documentType}`,
        type: 'document_download'
      });
      
      // Track download event
      await storage.createAnalytics({
        eventType: 'download',
        data: { document: documentType, email, name },
        userAgent: req.get('User-Agent') || '',
        ip: req.ip || '',
      });

      // Map document types to actual files (английские имена для заголовков)
      const documentMap: Record<string, { filename: string; extension: string }> = {
        'egrn-excerpt': { filename: 'EGRN_excerpt', extension: 'pdf' },
        'technical-passport': { filename: 'Technical_passport', extension: 'pdf' },
        'floor-plans': { filename: 'Floor_plans', extension: 'png' }
      };

      const docInfo = documentMap[documentType];
      if (!docInfo) {
        return res.status(404).json({ 
          success: false, 
          error: 'Document not found' 
        });
      }

      // ПРЯМОЕ СКАЧИВАНИЕ ФАЙЛА БЕЗ JSON ОТВЕТА
      const filePath = path.join(process.cwd(), 'public', 'documents', `${documentType}.${docInfo.extension}`);
      
      // Проверяем что файл существует
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          error: 'File not found on server' 
        });
      }

      // Устанавливаем заголовки для принудительного скачивания
      res.setHeader('Content-Disposition', `attachment; filename="${docInfo.filename}.${docInfo.extension}"`);
      res.setHeader('Content-Type', docInfo.extension === 'pdf' ? 'application/pdf' : 'image/png');
      
      // Отдаем файл напрямую
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error processing download:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Legacy document download endpoint
  app.get("/api/download/:document", async (req, res) => {
    const { document } = req.params;
    
    // Track download event
    await storage.createAnalytics({
      eventType: 'download',
      data: { document },
      userAgent: req.get('User-Agent') || '',
      ip: req.ip || '',
    });

    res.json({ 
      success: true, 
      message: `Download initiated for ${document}`,
      downloadUrl: `/documents/${document}.pdf`
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
