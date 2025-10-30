import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { token: string };
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Empty token" });
    return;
  }

  (req as AuthenticatedRequest).user = { token };
  next();
}
