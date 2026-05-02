import { Express } from "express";
import { getFileData } from "./storage";

export function registerFileRoutes(app: Express) {
  // Serve uploaded files
  app.get("/api/files/:key", async (req, res) => {
    try {
      const { key } = req.params;

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
