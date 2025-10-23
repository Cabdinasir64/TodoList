import { Router } from "express";
import { createUser, loginUser, logoutUser, getMe } from "../controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";
import { limiter } from "../middleware/limiter";

const router = Router();

router.post("/register", limiter,createUser);

router.post("/login", limiter, loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getMe);

export default router;
