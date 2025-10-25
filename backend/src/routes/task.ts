import { Router } from "express";
import {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getTasksOverview,
    getTaskID,
} from "../controllers/task";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();


router.post("/", authMiddleware, roleMiddleware(["user"]), createTask);

router.get("/", authMiddleware, roleMiddleware(["user"]), getTasks);

router.get("/overview", authMiddleware, roleMiddleware(["user"]), getTasksOverview);

router.get("/:id", authMiddleware, roleMiddleware(["user"]), getTaskID);

router.put("/:id", authMiddleware, roleMiddleware(["user"]), updateTask);

router.delete("/:id", authMiddleware, roleMiddleware(["user"]), deleteTask);

export default router;
