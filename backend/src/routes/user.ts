import { Router } from "express";
import {
    createUser, loginUser, logoutUser, getMe, getAdminDashboard, getUsers, updateUserRole
} from "../controllers/user";
const router = Router();

router.post("/register", createUser);

router.get("/admin/users", getUsers);

router.put("/admin/users/:userId/role", updateUserRole);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", getMe);

router.get("/admin/dashboard", getAdminDashboard);

export default router;
