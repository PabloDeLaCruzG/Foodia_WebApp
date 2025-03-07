import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/AuthController";
import { validateRequest } from "../middleware/validation";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Debe proporcionar un email válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres"),
  validateRequest,
  AuthController.register
);

// POST /api/auth/login
router.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  validateRequest,
  AuthController.login
);

export default router;
