import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        req.user = req.session.user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authenticated" });
    }
};
