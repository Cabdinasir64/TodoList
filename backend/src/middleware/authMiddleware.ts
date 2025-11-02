import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../models/AuditLog";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const ipAddress: string | undefined = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor ?? req.socket.remoteAddress ?? undefined;

    const userAgent: string | undefined = req.headers['user-agent'];

    let reason = "";

    try {
        if (!req.session) {
            reason = "no_session_cookie";
            await logAudit(req, 401, false, reason, ipAddress, userAgent);
            return res.status(401).json({ message: "No session cookie" });
        }

        if (!req.session.user) {
            reason = "user_not_authenticated";
            await logAudit(req, 401, false, reason, ipAddress, userAgent);
            return res.status(401).json({ message: "User not authenticated" });
        }

        req.user = req.session.user;
        await logAudit(req, 200, true, "authenticated", ipAddress, userAgent);

        next();
    } catch (error) {
        reason = "server_error";
        await logAudit(req, 500, false, reason, ipAddress, userAgent);
        return res.status(401).json({ message: "Not authenticated" });
    }
};

async function logAudit(
    req: AuthRequest,
    statusCode: number,
    success: boolean,
    reason: string,
    ipAddress?: string,
    userAgent?: string
) {
    try {
        if (!AuditLog) return;
        await AuditLog.create({
            eventTime: new Date(),
            userId: req.session?.user?.id,
            username: req.session?.user?.username,
            eventType: "auth_request",
            method: req.method,
            path: req.originalUrl,
            statusCode,
            success,
            reason,
            ipAddress,
            userAgent,
            requestBody: redactSensitive(req.body),
        });
    } catch (err) {
        console.error("Audit log failed:", err);
    }
}

function redactSensitive(body: any) {
    if (!body) return null;
    const copy = { ...body };
    if (copy.password) copy.password = "[REDACTED]";
    return copy;
}

