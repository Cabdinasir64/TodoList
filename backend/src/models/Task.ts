import { Document, Model, model, Schema, Types } from "mongoose";
import User from "./user";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "pending" | "in-progress" | "completed";
    user: Types.ObjectId; 
    createdAt?: Date;
    updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        strict: true,
        timestamps: true,
        versionKey: false,
    }
);

const Task: Model<ITask> = model<ITask>("tasks", TaskSchema);
export default Task;
