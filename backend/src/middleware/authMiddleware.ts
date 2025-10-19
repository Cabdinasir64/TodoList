import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
