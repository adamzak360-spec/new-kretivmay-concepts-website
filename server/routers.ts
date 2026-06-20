import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import bcryptjs from "bcryptjs";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const appRouter = router({
  system: systemRouter,
  adminAuth: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (input.password !== adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid admin password" });
        }
        
        // Create a temporary admin user if it doesn't exist
        let adminUser = await db.getUserByEmail("admin@kretivmay.local");
        if (!adminUser) {
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(adminPassword, salt);
          const openId = `admin_${Math.random().toString(36).slice(2, 11)}`;
          await db.createUser({
            openId,
            email: "admin@kretivmay.local",
            password: hashedPassword,
            name: "Admin",
            loginMethod: "admin",
            role: "admin",
          });
          adminUser = await db.getUserByEmail("admin@kretivmay.local");
        }
        
        if (!adminUser) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create admin session" });
        }
        
        // Create session token
        const sessionToken = await (ctx as any).sdk.createSessionToken(adminUser.openId, {
          name: adminUser.name || "Admin",
          expiresInMs: ONE_YEAR_MS,
        });
        
        const cookieOptions = getSessionCookieOptions((ctx as any).req);
        (ctx as any).res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        
        return { success: true, user: adminUser };
      }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    signUp: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already exists" });
        
        // Hash password using bcryptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(input.password, salt);
        
        const openId = `local_${Math.random().toString(36).slice(2, 11)}`;
        await db.createUser({
          openId,
          email: input.email,
          password: hashedPassword,
          name: input.name,
          loginMethod: "local",
        });
        return { success: true };
      }),
    signIn: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }
        
        // Compare password hash
        const isPasswordValid = await bcryptjs.compare(input.password, user.password);
        if (!isPasswordValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }
        
        const sessionToken = await (ctx as any).sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions((ctx as any).req);
        (ctx as any).res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return { success: true, user };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions((ctx as any).req);
      (ctx as any).res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateUser(ctx.user.id, input);
        return { success: true };
      }),
  }),

  orders: router({
    list: protectedProcedure.query(({ ctx }) => db.getOrdersByUserId(ctx.user.id)),
    byId: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
      const order = await db.getOrderById(input);
      if (!order || order.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return order;
    }),
  }),

  // Portfolio
  portfolio: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(({ input }) => db.getPortfolioItems(input?.category)),
    featured: publicProcedure.query(() => db.getFeaturedPortfolioItems()),
    byId: publicProcedure.input(z.number()).query(({ input }) => db.getPortfolioItemById(input)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string(),
        featured: z.boolean().optional(),
        imageUrl: z.string(),
        imageKey: z.string(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createPortfolioItem(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string(),
        featured: z.boolean().optional(),
        imageUrl: z.string(),
        imageKey: z.string(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updatePortfolioItem(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deletePortfolioItem(input.id);
      }),
  }),

  // Services
  services: router({
    list: publicProcedure.query(() => db.getServices()),
    bySlug: publicProcedure.input(z.string()).query(({ input }) => db.getServiceBySlug(input)),
    byId: publicProcedure.input(z.number()).query(({ input }) => db.getServiceById(input)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        fullDescription: z.string().optional(),
        bannerImageUrl: z.string().optional(),
        bannerImageKey: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createService(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        fullDescription: z.string().optional(),
        bannerImageUrl: z.string().optional(),
        bannerImageKey: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateService(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteService(input.id);
      }),
  }),

  // Blog
  blog: router({
    list: publicProcedure.query(() => db.getPublishedBlogPosts()),
    bySlug: publicProcedure.input(z.string()).query(({ input }) => db.getBlogPostBySlug(input)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        featuredImageKey: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createBlogPost(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        featuredImageKey: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateBlogPost(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteBlogPost(input.id);
      }),
  }),

  // Testimonials
  testimonials: router({
    featured: publicProcedure.query(() => db.getFeaturedTestimonials()),
    list: protectedProcedure.query(({ ctx }) => {
      if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAllTestimonials();
    }),
    create: protectedProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientCompany: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createTestimonial(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clientName: z.string().min(1),
        clientCompany: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateTestimonial(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteTestimonial(input.id);
      }),
  }),

  // Contact
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(({ input }) => db.createContactSubmission(input)),
    list: protectedProcedure.query(({ ctx }) => {
      if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getContactSubmissions();
    }),
    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.markContactSubmissionAsRead(input);
      }),
  }),

  // Site Settings
  settings: router({
    get: publicProcedure
      .input(z.string())
      .query(({ input }) => db.getSiteSetting(input)),
    set: protectedProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.setSiteSetting(input.key, input.value);
      }),
  }),

  // Page Content
  pages: router({
    get: publicProcedure
      .input(z.object({ page: z.string(), section: z.string().optional() }))
      .query(({ input }) => db.getPageContent(input.page, input.section)),
    upsert: protectedProcedure
      .input(z.object({
        page: z.string(),
        section: z.string(),
        content: z.any(),
      }))
      .mutation(({ input, ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.upsertPageContent(input);
      }),
  }),

  // Admin Dashboard & Management
  admin: router({
    stats: protectedProcedure.query(({ ctx }) => {
      if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAdminStats();
    }),
    
    // Products
    products: router({
      list: publicProcedure.query(() => db.getProducts()),
      create: protectedProcedure
        .input(z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          price: z.number(),
          stock: z.number(),
          categoryId: z.number().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          featured: z.boolean().optional(),
          available: z.boolean().optional(),
        }))
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          return db.createProduct(input as any);
        }),
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          stock: z.number().optional(),
          categoryId: z.number().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          featured: z.boolean().optional(),
          available: z.boolean().optional(),
        }))
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          const { id, ...data } = input;
          return db.updateProduct(id, data as any);
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          return db.deleteProduct(input);
        }),
    }),

    // Categories
    categories: router({
      list: publicProcedure.query(() => db.getCategories()),
      create: protectedProcedure
        .input(z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          icon: z.string().optional(),
          order: z.number().optional(),
        }))
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          return db.createCategory(input as any);
        }),
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          icon: z.string().optional(),
          order: z.number().optional(),
        }))
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          const { id, ...data } = input;
          return db.updateCategory(id, data as any);
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          return db.deleteCategory(input);
        }),
    }),

    // Orders
    orders: router({
      list: protectedProcedure.query(({ ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.getAllOrders();
      }),
      updateStatus: protectedProcedure
        .input(z.object({ id: z.number(), status: z.string() }))
        .mutation(({ input, ctx }) => {
          if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
          return db.updateOrderStatus(input.id, input.status);
        }),
    }),

    // Customers
    customers: router({
      list: protectedProcedure.query(({ ctx }) => {
        if ((ctx as any).user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.getAllCustomers();
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
