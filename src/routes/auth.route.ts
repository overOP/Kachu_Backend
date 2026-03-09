import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import { Role } from "../enum/auth.enum";

const router = Router();

router.route("/register").post(catchAsync(AuthController.registerUser));
router.route("/login").post(catchAsync(AuthController.loginUser));
router.route("/forgot-password").post(catchAsync(AuthController.forgotPassword));
router.route("/verify-otp").post(catchAsync(AuthController.verifyOtp));
router.route("/reset-password").post(catchAsync(AuthController.resetPassword));
router.route("/all-users").get(auth.isAuthenticated,auth.restrictTo(Role.Admin, Role.Superadmin),catchAsync(AuthController.getAllUsers));

export default router;
