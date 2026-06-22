import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";
import bcryptjs from "bcryptjs";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const adminAuthRouter = router({
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("[AdminAuth] Login attempt started");
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        
        if (input.password !== adminPassword) {
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: "Invalid admin password" 
          });
        }

        // Try to get or create admin user
        let adminUser = null;
        try {
          adminUser = await db.getUserByEmail("admin@kretivmay.local");
          
          if (!adminUser) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(adminPassword, salt);
            const openId = `admin_local_${Date.now()}`;
            
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
          
          // Ensure admin role
          if (adminUser && adminUser.role !== "admin") {
            await db.updateUser(adminUser.id, { role: "admin" });
            adminUser = await db.getUserByEmail("admin@kretivmay.local");
          }
        } catch (dbError) {
          console.error("Database error during admin auth:", dbError);
          // If database fails, create a temporary admin user object for session
          adminUser = {
            id: 1,
            openId: `admin_temp_${Date.now()}`,
            email: "admin@kretivmay.local",
            name: "Admin",
            role: "admin" as const,
            loginMethod: "admin",
            password: null,
            phone: null,
            address: null,
            city: null,
            state: null,
            zipCode: null,
            country: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSignedIn: new Date(),
          };
        }

        if (!adminUser) {
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "Failed to create admin session" 
          });
        }

        // Create session token
        try {
          console.log("[AdminAuth] Creating session for:", adminUser.openId);
          const sessionToken = await ctx.sdk.createSessionToken(
            adminUser.openId,
            {
              name: adminUser.name || "Admin",
              expiresInMs: ONE_YEAR_MS,
            }
          );

          const cookieOptions = getSessionCookieOptions((ctx as any).req);
          console.log("[AdminAuth] Cookie options:", JSON.stringify(cookieOptions));
          (ctx as any).res.cookie(COOKIE_NAME, sessionToken, {
            ...cookieOptions,
            maxAge: ONE_YEAR_MS,
          });

          console.log("[AdminAuth] Login successful");
          return { success: true, user: adminUser };
        } catch (tokenError) {
          console.error("Session token creation error:", tokenError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create session token",
          });
        }
      } catch (error) {
        console.error("Admin login error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),
});
