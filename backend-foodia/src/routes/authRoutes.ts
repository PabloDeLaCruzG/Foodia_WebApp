import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/AuthController";
import { validateRequest } from "../middleware/validation";

const router = Router();

router.post(
  "/google",
  body("idToken")
    .isString()
    .withMessage("Debe proporcionar un token de Google"),
  validateRequest,
  AuthController.googleAuth
);
// POST /api/auth/register
router.post(
  "/register",
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

router.post("/logout", AuthController.logout);

router.post(
  "/checkEmailExists",
  validateRequest,
  AuthController.checkEmailExists
);

export default router;
