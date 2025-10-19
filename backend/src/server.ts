import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongodb";
import { limiter } from "./middleware/limiter";
import userRoutes from "./routes/user";
import taskRoutes from "./routes/task";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();




const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(limiter)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)




app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
