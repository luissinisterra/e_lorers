import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1] ?? "";

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: "JWT secret not configured" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};


