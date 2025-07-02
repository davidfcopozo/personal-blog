import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// Global response tracking to prevent duplicate responses
const processedResponses = new Set<string>();

export const requestTrackingMiddleware = (
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction
) => {
  req.requestId = uuidv4();

  // Override res.json to add response tracking
  const originalJson = res.json;
  res.json = function (data: any) {
    // Add request tracking to response
    if (data && typeof data === "object") {
      data.requestId = req.requestId;
      data.serverTimestamp = Date.now();

      const responseId = `${req.method}-${req.path}-${req.requestId}`;

      if (processedResponses.has(responseId)) {
        return res.status(409).json({
          error: "Duplicate response detected",
          originalRequestId: req.requestId,
        });
      }

      processedResponses.add(responseId);
      data.responseId = responseId;

      // Clean up old responses (keep last 1000)
      if (processedResponses.size > 1000) {
        const responses = Array.from(processedResponses);
        responses.slice(0, 500).forEach((id) => processedResponses.delete(id));
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

export default requestTrackingMiddleware;
