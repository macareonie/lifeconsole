import { Router } from "express";
import { body } from "express-validator";
import validateInputs from "../../utils/input-validation.js";
import { register, login } from "./auth.controller.js";

const authRouter = Router();

const validateNewUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const validateExistingUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

authRouter.post("/register", validateInputs(validateNewUser), register);

authRouter.post("/login", validateInputs(validateExistingUser), login);

export default authRouter;
