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


router.post("/", roleMiddleware(["user"]), createTask);

router.get("/", roleMiddleware(["user"]), getTasks);

router.get("/overview", roleMiddleware(["user"]), getTasksOverview);

router.get("/:id", roleMiddleware(["user"]), getTaskID);

router.put("/:id", roleMiddleware(["user"]), updateTask);

router.delete("/:id", roleMiddleware(["user"]), deleteTask);

export default router;
