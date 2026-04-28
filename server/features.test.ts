import { describe, it, expect } from "vitest";
import * as db from "./db";

const TIMEOUT = 10000;

describe("Portfolio Features", () => {
  it("should retrieve portfolio items", async () => {
    const items = await db.getPortfolioItems();
    expect(Array.isArray(items)).toBe(true);
  }, TIMEOUT);

  it("should retrieve featured portfolio items", async () => {
    const featured = await db.getFeaturedPortfolioItems();
    expect(Array.isArray(featured)).toBe(true);
  }, TIMEOUT);

  it("should filter portfolio by category", async () => {
    const design = await db.getPortfolioItems("design");
    expect(Array.isArray(design)).toBe(true);
  }, TIMEOUT);
});

describe("Services Features", () => {
  it("should retrieve all services", async () => {
    const services = await db.getServices();
    expect(Array.isArray(services)).toBe(true);
  }, TIMEOUT);

  it("should handle service retrieval by slug", async () => {
    const service = await db.getServiceBySlug("test-slug");
    expect(service === null || typeof service === "object").toBe(true);
  }, TIMEOUT);

  it("should handle service retrieval by id", async () => {
    const service = await db.getServiceById(1);
    expect(service === null || typeof service === "object").toBe(true);
  }, TIMEOUT);
});

describe("Contact Features", () => {
  it("should retrieve contact submissions", async () => {
    const submissions = await db.getContactSubmissions();
    expect(Array.isArray(submissions)).toBe(true);
  }, TIMEOUT);

  it("should handle marking submission as read", async () => {
    const result = await db.markContactSubmissionAsRead(1);
    expect(result === null || typeof result === "object").toBe(true);
  }, TIMEOUT);
});

describe("Testimonials Features", () => {
  it("should retrieve featured testimonials", async () => {
    const testimonials = await db.getFeaturedTestimonials();
    expect(Array.isArray(testimonials)).toBe(true);
  }, TIMEOUT);
});

describe("Blog Features", () => {
  it("should retrieve published blog posts", async () => {
    const posts = await db.getPublishedBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
  }, TIMEOUT);

  it("should handle blog post retrieval by slug", async () => {
    const post = await db.getBlogPostBySlug("test-post");
    expect(post === null || typeof post === "object").toBe(true);
  }, TIMEOUT);
});
