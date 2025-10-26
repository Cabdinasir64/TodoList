import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongodb";
import userRoutes from "./routes/user";
import taskRoutes from "./routes/task";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();




const app = express();

app.set('trust proxy', 1);

app.use(cookieParser());

app.use(cors({
    origin: "https://todo-list-cyan-zeta.vercel.app",
    credentials: true,
}));

app.use(express.json());
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)




app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
