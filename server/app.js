import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalLimiter } from "./config/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import helmet from "helmet";
import aiRoutes from "./routes/ai.route.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
    'http://localhost:5173',
    'https://devika-1-jxbb.onrender.com'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(globalLimiter);


app.use("/users",userRoutes);
app.use("/projects",projectRoutes);
app.use("/ai",aiRoutes);
app.use("/",(req,res)=>{
    res.send("hello world");
})

app.use(errorHandler);

export default app;