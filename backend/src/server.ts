import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongodb";
import userRoutes from "./routes/user";
import taskRoutes from "./routes/task";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

connectDB();

const app = express();

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(express.json());

app.use(session({
    name: "sessionId",
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI!,
        collectionName: "sessions",
        ttl: 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "none"
    }
}));

app.use(cors({
    origin: "https://todo-list-cyan-zeta.vercel.app",
    credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
