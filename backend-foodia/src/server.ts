import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import recipeRoutes from "./routes/recipeRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://foodia-frontend.vercel.app'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// get de ping pong
app.get("/ping", (req, res) => {
  res.send("pong");
});

export default app;
