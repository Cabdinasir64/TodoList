import { Router } from "express";
import {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    searchTasks,
    filterTasks,
} from "../controllers/task";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.get("/search", authMiddleware, searchTasks);

router.get("/filter", authMiddleware, filterTasks);

export default router;
