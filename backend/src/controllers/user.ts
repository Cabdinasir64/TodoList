import { Request, Response } from "express";
import User from "../models/user";
import { validateUser } from "../utils/uservalidation";
import { hashPassword, comparePassword } from "../utils/password";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "1d";


export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const { valid, errors } = validateUser({ username, email, password });
        if (!valid) {
            return res.status(400).json({ message: "Validation errors", errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists." });
        }

        const hashedPassword = await hashPassword(password);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user",
        });

        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            redirect: user.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};