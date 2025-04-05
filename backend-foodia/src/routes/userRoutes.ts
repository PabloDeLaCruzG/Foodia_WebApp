import { Router } from "express";
import { validateRequest } from "../middleware/validation";
import UserController from "../controllers/UserController";
import authenticateUser from "../middleware/authenticateUser";

const userRoutes = Router();

userRoutes.get("/user", authenticateUser, UserController.getCurrentUser);

userRoutes.post(
  "/watchAdReward",
  authenticateUser,
  UserController.watchAdReward
);

userRoutes.get("/dailyStatus", authenticateUser, UserController.getDailyStatus);

export default userRoutes;
