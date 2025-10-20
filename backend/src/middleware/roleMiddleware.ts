import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Not authenticated" });
            }

            const userRole = req.user.role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            console.error("Role check failed:", error);
            return res.status(500).json({ message: "Server error" });
        }
    };
};
