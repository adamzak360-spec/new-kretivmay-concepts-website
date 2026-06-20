import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertContactSubmission, users, portfolioItems, services, blogPosts, testimonials, contactSubmissions, siteSettings, pageContent, PageContent, InsertPageContent, orders, orderItems, Order, InsertOrder, OrderItem, InsertOrderItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(users).values(user);
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(users).set(data).where(eq(users.id, id));
}

// Order functions
export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(orders.createdAt);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (result.length === 0) return null;
  
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...result[0], items };
}

export async function createOrder(order: InsertOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) return null;
  
  return await db.transaction(async (tx) => {
    const [result] = await tx.insert(orders).values(order);
    const orderId = (result as any).insertId;
    
    for (const item of items) {
      await tx.insert(orderItems).values({ ...item, orderId });
    }
    
    return orderId;
  });
}

// Portfolio queries
export async function getPortfolioItems(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return db.select().from(portfolioItems).where(eq(portfolioItems.category, category as any)).orderBy(portfolioItems.order);
  }
  return db.select().from(portfolioItems).orderBy(portfolioItems.order);
}

export async function getFeaturedPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems).where(eq(portfolioItems.featured, true)).orderBy(portfolioItems.order);
}

export async function getPortfolioItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
  return result[0] || null;
}

export async function createPortfolioItem(data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(portfolioItems).values(data);
}

export async function updatePortfolioItem(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.update(portfolioItems).set(data).where(eq(portfolioItems.id, id));
}

export async function deletePortfolioItem(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}

// Services queries
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.order);
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0] || null;
}

export async function createService(data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(services).values(data);
}

export async function updateService(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(services).where(eq(services.id, id));
}

// Blog queries
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(blogPosts.publishedAt);
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0] || null;
}

export async function createBlogPost(data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(blogPosts).values(data);
}

export async function updateBlogPost(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// Testimonials queries
export async function getFeaturedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(testimonials.order);
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(testimonials.order);
}

export async function createTestimonial(data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(testimonials).values(data);
}

export async function updateTestimonial(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(testimonials).where(eq(testimonials.id, id));
}

// Contact submissions
export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(contactSubmissions).values(data);
  return result;
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
}

export async function markContactSubmissionAsRead(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.update(contactSubmissions).set({ read: true }).where(eq(contactSubmissions.id, id));
}

// Site settings
export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value || null;
}

export async function setSiteSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// Page Content queries
export async function getPageContent(page: string, section?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (section) {
    return db.select().from(pageContent).where(and(eq(pageContent.page, page), eq(pageContent.section, section)));
  }
  return db.select().from(pageContent).where(eq(pageContent.page, page));
}

export async function upsertPageContent(data: InsertPageContent) {
  const db = await getDb();
  if (!db) return null;
  
  // Check if it exists
  const existing = await db.select().from(pageContent)
    .where(and(eq(pageContent.page, data.page), eq(pageContent.section, data.section)))
    .limit(1);
    
  if (existing.length > 0) {
    return db.update(pageContent)
      .set({ content: data.content })
      .where(eq(pageContent.id, existing[0].id));
  } else {
    return db.insert(pageContent).values(data);
  }
}
