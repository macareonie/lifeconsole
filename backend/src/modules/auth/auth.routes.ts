import { Router } from "express";
import { body } from "express-validator";
import validateInputs from "../../utils/input-validation.js";
import { register, login } from "./auth.controller.js";

const authRouter = Router();

const validateUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

authRouter.post("/register", validateInputs(validateUser), register);

authRouter.post("/login", validateInputs(validateUser), login);

export default authRouter;
