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

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const status = (req.query.status as string) || '';

        const validLimits = [10, 20, 30, 40, 50];
        if (!validLimits.includes(limit)) {
            return res.status(400).json({
                message: "Invalid limit. Available options: 10, 20, 30, 40, 50"
            });
        }

        const skip = (page - 1) * limit;

        const filter: any = { user: req.user.id };

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            filter.status = status;
        }

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title description status createdAt')
            .lean();

        const totalTasks = await Task.countDocuments(filter);

        const totalPages = Math.ceil(totalTasks / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        res.status(200).json({
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalTasks,
                hasNext,
                hasPrev,
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getTasksOverview = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const tasks = await Task.find({ user: req.user.id })
            .select('title description status createdAt')
            .lean();

        const total = tasks.length;
        const pending = tasks.filter(task => task.status === 'pending').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const completed = tasks.filter(task => task.status === 'completed').length;

        const recentTasks = tasks
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 5);

        res.status(200).json({
            message: "Overview data fetched successfully",
            statistics: {
                total,
                pending,
                inProgress,
                completed
            },
            recentTasks,
            allTasks: tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
