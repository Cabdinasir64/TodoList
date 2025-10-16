import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please provide a valid email address (e.g., user@example.com)",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
        },
         role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        strict: true,
        timestamps: true,
        versionKey: false,
    }
);

const User: Model<IUser> = model<IUser>("users", UserSchema);
export default User;
