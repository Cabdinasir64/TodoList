import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from '../middleware/authMiddleware'



export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            user: req.user.id,
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const task = await Task.findOne({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        await task.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const searchTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { query } = req.query;

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const tasks = await Task.find({
            user: req.user.id,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const filterTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!status || !["pending", "in-progress", "completed"].includes(status as string)) {
            return res.status(400).json({ message: "Invalid or missing status" });
        }

        const tasks = await Task.find({
            user: req.user.id,
            status,
        });

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
