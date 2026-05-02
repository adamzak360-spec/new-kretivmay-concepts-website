// Simplified storage implementation using database
// This stores file metadata in the database and serves files directly

import { db } from "./db";
import { uploads } from "../drizzle/schema";
import crypto from "crypto";

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  try {
    // Generate a unique key
    const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const lastDot = relKey.lastIndexOf(".");
    const key = lastDot === -1 
      ? `${relKey}_${hash}` 
      : `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;

    // Convert data to base64 for storage
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
    }).returning();

    if (!result || result.length === 0) {
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
  return {
    key: relKey,
    url: `/api/files/${relKey}`,
  };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  return `/api/files/${relKey}`;
}

export async function getFileData(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const result = await db.query.uploads.findFirst({
      where: (uploads, { eq }) => eq(uploads.key, key),
    });

    if (!result || !result.data) {
      return null;
    }

    const buffer = Buffer.from(result.data, "base64");
    return {
      data: buffer,
      contentType: result.contentType || "application/octet-stream",
    };
  } catch (error) {
    console.error("Storage get error:", error);
    return null;
  }
}
