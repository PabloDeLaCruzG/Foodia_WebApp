import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import recipeRoutes from "./routes/recipeRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Routes
app.use("/api/recipes", recipeRoutes);

export default app;
