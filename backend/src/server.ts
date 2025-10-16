import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongodb";
import { limiter } from "./middleware/limiter";
import userRoutes from "./routes/user";

dotenv.config();
connectDB();


const app = express();
app.use(express.json());
app.use(limiter)
app.use("/api/users", userRoutes)




app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
