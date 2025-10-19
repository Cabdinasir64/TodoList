import { Router } from "express";
import {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
} from "../controllers/task";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

export default router;
