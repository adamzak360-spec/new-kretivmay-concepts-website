import { Express } from "express";
import { storagePut } from "./storage";

export function registerUploadRoutes(app: Express) {
  // Handle file uploads via FormData
  app.post("/api/upload", async (req, res) => {
    try {
      const contentType = req.headers["content-type"];
      
      // Handle FormData with multipart/form-data
      if (contentType && contentType.includes("multipart/form-data")) {
        // Parse multipart form data manually
        const boundary = contentType.split("boundary=")[1];
        if (!boundary) {
          return res.status(400).json({ error: "Invalid multipart boundary" });
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        req.on("end", async () => {
          try {
            const buffer = Buffer.concat(chunks);
            // Use binary encoding to avoid corrupting binary data
            const boundaryStr = `--${boundary}`;
            const boundaryBuffer = Buffer.from(boundaryStr);
            
            let start = 0;
            let fileBuffer: Buffer | null = null;
            let fileName = `upload-${Date.now()}`;
            let mimeType = "application/octet-stream";

            // Find parts by boundary
            while (start < buffer.length) {
              const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
              if (boundaryIndex === -1) break;
              
              const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
              if (nextBoundaryIndex === -1) break;

              const part = buffer.slice(boundaryIndex + boundaryBuffer.length, nextBoundaryIndex);
              const headerEnd = part.indexOf("\r\n\r\n");
              
              if (headerEnd !== -1) {
                const headers = part.slice(0, headerEnd).toString();
                const body = part.slice(headerEnd + 4);
                
                // Extract filename if present
                const filenameMatch = headers.match(/filename="([^"]+)"/);
                if (filenameMatch) {
                  fileName = filenameMatch[1];
                  
                  // Extract content type
                  const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
                  if (contentTypeMatch) {
                    mimeType = contentTypeMatch[1].trim();
                  }

                  // Extract file body (remove trailing \r\n)
                  fileBuffer = body.slice(0, body.length - 2);
                  break;
                }
              }
              start = nextBoundaryIndex;
            }

            if (!fileBuffer || fileBuffer.length === 0) {
              return res.status(400).json({ error: "No file data found" });
            }

            // Validate file size (max 20MB)
            const maxSize = 20 * 1024 * 1024;
            if (fileBuffer.length > maxSize) {
              return res.status(413).json({ error: "File too large (max 20MB)" });
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
            if (!allowedMimes.includes(mimeType)) {
              return res.status(400).json({ error: "Invalid file type" });
            }

            // Upload to storage
            const { url, key } = await storagePut(
              `uploads/${Date.now()}-${fileName}`,
              fileBuffer,
              mimeType
            );

            res.json({
              success: true,
              url,
              key,
              fileName,
              size: fileBuffer.length,
              mimeType,
            });
          } catch (error) {
            console.error("Upload processing error:", error);
            res.status(500).json({ error: "Upload processing failed" });
          }
        });

        req.on("error", (error) => {
          console.error("Upload stream error:", error);
          res.status(500).json({ error: "Upload failed" });
        });
      } else {
        // Handle raw binary upload
        const chunks: Buffer[] = [];
        
        req.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        req.on("end", async () => {
          try {
            const fileBuffer = Buffer.concat(chunks);
            const maxSize = 20 * 1024 * 1024;
            
            if (fileBuffer.length > maxSize) {
              return res.status(413).json({ error: "File too large (max 20MB)" });
            }

            const mimeType = req.headers["content-type"] || "application/octet-stream";
            const fileName = `upload-${Date.now()}`;

            const { url, key } = await storagePut(
              `uploads/${fileName}`,
              fileBuffer,
              mimeType
            );

            res.json({
              success: true,
              url,
              key,
              fileName,
              size: fileBuffer.length,
              mimeType,
            });
          } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ error: "Upload failed" });
          }
        });

        req.on("error", (error) => {
          console.error("Upload stream error:", error);
          res.status(500).json({ error: "Upload failed" });
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
