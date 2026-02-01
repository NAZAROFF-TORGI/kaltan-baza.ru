import { type User, type InsertUser, type Lead, type InsertLead, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(): Promise<Analytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.analytics = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead, 
      id, 
      score: 0,
      priority: "medium",
      status: "new",
      lastActivity: new Date(),
      createdAt: new Date()
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const existingLead = this.leads.get(id);
    if (!existingLead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    const updatedLead = { ...existingLead, ...updates };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id, 
      createdAt: new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }
}

// Use database storage instead of memory
import { db } from "@shared/db";
import { leads as leadsTable, analytics as analyticsTable, users as usersTable } from "@shared/schema";
import { eq } from "drizzle-orm";

class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(userData).returning();
    return user;
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leadsTable).values({
      ...leadData,
      email: leadData.email || null,
      message: leadData.message || null,
      score: 0,
      priority: 'medium',
      status: 'new',
      lastActivity: new Date(),
      createdAt: new Date()
    }).returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leadsTable);
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const [updated] = await db.update(leadsTable)
      .set(updates)
      .where(eq(leadsTable.id, id))
      .returning();
    return updated;
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analytics_record] = await db.insert(analyticsTable).values({
      ...analyticsData,
      data: analyticsData.data || null,
      userAgent: analyticsData.userAgent || null,
      ip: analyticsData.ip || null,
      createdAt: new Date()
    }).returning();
    return analytics_record;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analyticsTable);
  }
}

export const storage: IStorage = new DatabaseStorage();
