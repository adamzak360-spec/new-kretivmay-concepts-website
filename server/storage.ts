// Simplified storage implementation using database
// Files are stored as base64 in the database and served directly

import { getDb } from "./db";
import { uploads } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import crypto from "crypto";

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available for storage");
    }
    
    const key = appendHashSuffix(normalizeKey(relKey));
    const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
    const base64Data = buffer.toString("base64");

    // Store in database
    const result = await db.insert(uploads).values({
      key,
      fileName: relKey,
      contentType,
      data: base64Data,
      size: buffer.length,
      createdAt: new Date(),
    }).$returningId();

    if (!result || !Array.isArray(result) || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to store file in database");
    }

    return {
      key,
      url: `/api/files/${key}`,
    };
  } catch (error) {
    console.error("Storage put error:", error);
    throw new Error(`Storage upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return {
    key,
    url: `/api/files/${key}`,
  };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  return `/api/files/${normalizeKey(relKey)}`;
}

export async function getFileData(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const db = await getDb();
    if (!db) {
      return null;
    }
    
    const result = await (db as any).query.uploads.findFirst({
      where: (uploadsTable: any, { eq }: any) => eq(uploadsTable.key, key),
    });

    if (!result || !(result as any).data) {
      return null;
    }

    const dataStr = typeof (result as any).data === 'string' ? (result as any).data : String((result as any).data);
    const buffer = Buffer.from(dataStr, "base64");
    return {
      data: buffer,
      contentType: ((result as any).contentType as string) || "application/octet-stream",
    };
  } catch (error) {
    console.error("Storage get error:", error);
    return null;
  }
}
