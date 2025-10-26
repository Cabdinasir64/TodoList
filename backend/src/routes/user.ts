import { Router } from "express";
import {
    createUser, loginUser, logoutUser, getMe, getAdminDashboard, getUsers, updateUserRole
} from "../controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";
import { limiter } from "../middleware/limiter";

const router = Router();

router.post("/register", limiter, createUser);

router.get("/admin/users", authMiddleware, getUsers); 

router.put("/admin/users/:userId/role", authMiddleware, updateUserRole);

router.post("/login", limiter, loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getMe);

router.get("/admin/dashboard", authMiddleware, getAdminDashboard);

export default router;
