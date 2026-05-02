import type { Express } from "express";
import multer from "multer";
import { storagePut } from "./storage";

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export function registerUploadRoutes(app: Express) {
  // Handle file uploads via multer
  app.post("/api/upload", upload.single("file"), async (req: any, res: any) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Validate MIME type
      const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      
      if (!allowedMimes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type" });
      }

      // Upload to storage
      const { url, key } = await storagePut(
        `uploads/${Date.now()}-${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      res.json({
        success: true,
        url,
        key,
        fileName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
