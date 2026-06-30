import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  sdk: typeof sdk;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    console.log("[Context] Creating context for path:", opts.req.path);
    user = await sdk.authenticateRequest(opts.req);
    console.log("[Context] User authenticated:", user?.openId || "none");
  } catch (error) {
    console.error("[Context] Authentication error:", error);
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    sdk,
  };
}
