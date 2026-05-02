import type { Express } from "express";
import { getFileData } from "./storage";

export function registerFileRoutes(app: Express) {
  // Serve uploaded files - use wildcard to support multi-segment keys like 'uploads/...'
  app.get("/api/files/*", async (req: any, res: any) => {
    try {
      // Extract the full key from the wildcard parameter
      const key = ((req as any).params as any)[0];

      if (!key) {
        return (res as any).status(400).json({ error: "File key is required" });
      }

      const fileData = await getFileData(key);

      if (!fileData) {
        return (res as any).status(404).json({ error: "File not found" });
      }

      // Set appropriate headers
      (res as any).set("Content-Type", fileData.contentType);
      (res as any).set("Content-Length", fileData.data.length.toString());
      (res as any).set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      // Send the file
      (res as any).send(fileData.data);
    } catch (error) {
      console.error("File serving error:", error);
      (res as any).status(500).json({ error: "Failed to serve file" });
    }
  });
}
