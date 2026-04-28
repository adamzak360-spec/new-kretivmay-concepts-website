import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const TIMEOUT = 10000;

// Create a mock admin context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@kretivmay.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Create a mock user context (non-admin)
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Authentication", () => {
  it("should allow admin to access admin procedures", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    // Admin should be able to call auth.me
    const user = await caller.auth.me();
    expect(user?.role).toBe("admin");
  }, TIMEOUT);

  it("should allow regular user to access public procedures", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    // Regular user should be able to call auth.me
    const user = await caller.auth.me();
    expect(user?.role).toBe("user");
  }, TIMEOUT);
});

describe("Portfolio Management", () => {
  it("should retrieve portfolio items", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const items = await caller.portfolio.list({});
    expect(Array.isArray(items)).toBe(true);
  }, TIMEOUT);

  it("should handle portfolio filtering by category", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const design = await caller.portfolio.list({ category: "design" });
    expect(Array.isArray(design)).toBe(true);
  }, TIMEOUT);
});

describe("Services Management", () => {
  it("should retrieve all services", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const services = await caller.services.list();
    expect(Array.isArray(services)).toBe(true);
  }, TIMEOUT);

  it("should retrieve service by slug", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const service = await caller.services.bySlug("test");
    expect(service === null || typeof service === "object").toBe(true);
  }, TIMEOUT);
});

describe("Contact Submissions", () => {
  it("should retrieve contact submissions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const submissions = await caller.contact.list();
    expect(Array.isArray(submissions)).toBe(true);
  }, TIMEOUT);

  it("should allow contact form submission", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      phone: "+233123456789",
      message: "Test message",
    });
    
    expect(result).toBeDefined();
    expect(Array.isArray(result) || typeof result === "object").toBe(true);
  }, TIMEOUT);
});

describe("Blog Management", () => {
  it("should retrieve published blog posts", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const posts = await caller.blog.list();
    expect(Array.isArray(posts)).toBe(true);
  }, TIMEOUT);

  it("should retrieve blog post by slug", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const post = await caller.blog.bySlug("test-post");
    expect(post === null || typeof post === "object").toBe(true);
  }, TIMEOUT);
});

describe("Testimonials", () => {
  it("should retrieve featured testimonials", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    
    const testimonials = await caller.testimonials.featured();
    expect(Array.isArray(testimonials)).toBe(true);
  }, TIMEOUT);
});
