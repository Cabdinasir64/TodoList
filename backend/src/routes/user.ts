import { Router } from "express";
import { createUser, loginUser, logoutUser, getMe } from "../controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getMe);

export default router;
