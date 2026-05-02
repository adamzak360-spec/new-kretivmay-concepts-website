import { Express } from "express";
import { getFileData } from "./storage";

export function registerFileRoutes(app: Express) {
  // Serve uploaded files - use wildcard to support multi-segment keys like 'uploads/...'
  app.get("/api/files/*", async (req, res) => {
    try {
      // Extract the full key from the wildcard parameter
      const key = (req.params as any)[0];

      if (!key) {
        return res.status(400).json({ error: "File key is required" });
      }

      const fileData = await getFileData(key);

      if (!fileData) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set appropriate headers
      res.set("Content-Type", fileData.contentType);
      res.set("Content-Length", fileData.data.length.toString());
      res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      // Send the file
      res.send(fileData.data);
    } catch (error) {
      console.error("File serving error:", error);
      res.status(500).json({ error: "Failed to serve file" });
    }
  });
}
