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
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();


router.post("/", authMiddleware, roleMiddleware(["user"]), createTask);

router.get("/", authMiddleware, roleMiddleware(["user"]), getTasks);

router.put("/:id", authMiddleware, roleMiddleware(["user"]), updateTask);

router.delete("/:id", authMiddleware, roleMiddleware(["user"]), deleteTask);

router.get("/search", authMiddleware, roleMiddleware(["user"]), searchTasks);

router.get("/filter", authMiddleware, roleMiddleware(["user"]), filterTasks);

export default router;
