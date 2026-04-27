import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Portfolio
  portfolio: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(({ input }) => db.getPortfolioItems(input?.category)),
    featured: publicProcedure.query(() => db.getFeaturedPortfolioItems()),
    byId: publicProcedure.input(z.number()).query(({ input }) => db.getPortfolioItemById(input)),
  }),

  // Services
  services: router({
    list: publicProcedure.query(() => db.getServices()),
    bySlug: publicProcedure.input(z.string()).query(({ input }) => db.getServiceBySlug(input)),
    byId: publicProcedure.input(z.number()).query(({ input }) => db.getServiceById(input)),
  }),

  // Blog
  blog: router({
    list: publicProcedure.query(() => db.getPublishedBlogPosts()),
    bySlug: publicProcedure.input(z.string()).query(({ input }) => db.getBlogPostBySlug(input)),
  }),

  // Testimonials
  testimonials: router({
    featured: publicProcedure.query(() => db.getFeaturedTestimonials()),
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
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getContactSubmissions();
    }),
    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.markContactSubmissionAsRead(input);
      }),
  }),

  // Site Settings
  settings: router({
    get: protectedProcedure
      .input(z.string())
      .query(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.getSiteSetting(input);
      }),
    set: protectedProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.setSiteSetting(input.key, input.value);
      }),
  }),
});

export type AppRouter = typeof appRouter;
