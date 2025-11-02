import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { AuditLog } from "../models/AuditLog";

export const auditMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const audit: any = {
        eventTime: new Date(),
        userId: req.user?.id,
        username: req.user?.username,
        eventType: 'request',
        method: req.method,
        path: req.originalUrl,
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
    };

    const oldSend = res.send.bind(res);
    let responseBody: any;
    res.send = (body: any) => {
        responseBody = body;
        return oldSend(body);
    };

    res.on('finish', async () => {
        audit.statusCode = res.statusCode;
        audit.success = res.statusCode >= 200 && res.statusCode < 400;
        audit.reason = res.statusCode >= 400 ? 'failed_request' : 'success';
        audit.responseBody = summarizeResponse(responseBody);

        try {
            await AuditLog.create(audit);
        } catch (err) {
            console.error("Audit log failed:", err);
        }
    });

    next();
};

function summarizeResponse(body: any) {
    if (!body) return null;
    try {
        const str = typeof body === 'string' ? body : JSON.stringify(body);
        return str.length > 1000 ? str.slice(0, 1000) + '...[truncated]' : body;
    } catch {
        return null;
    }
}
