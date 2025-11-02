import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    eventTime: Date;
    userId?: string;
    username?: string;
    eventType: string;
    method?: string;
    path?: string;
    statusCode?: number;
    success?: boolean;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
    requestBody?: any;
    responseBody?: any;
}

const AuditLogSchema: Schema = new Schema({
    eventTime: { type: Date, default: Date.now },
    userId: { type: String },
    username: { type: String },
    eventType: { type: String, required: true },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    success: { type: Boolean },
    reason: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestBody: { type: Schema.Types.Mixed },
    responseBody: { type: Schema.Types.Mixed },
});

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
