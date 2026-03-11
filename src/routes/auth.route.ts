import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import { Role } from "../enum/auth.enum";
import multer from "multer";
import { storage } from "../middleware/multer";

const upload = multer({ storage });

const router = Router();

router.route("/register").post(catchAsync(AuthController.registerUser));
router.route("/login").post(catchAsync(AuthController.loginUser));
router.route("/forgot-password").post(catchAsync(AuthController.forgotPassword));
router.route("/verify-otp").post(catchAsync(AuthController.verifyOtp));
router.route("/reset-password").post(catchAsync(AuthController.resetPassword));
router.route("/all-users").get(auth.isAuthenticated,auth.restrictTo(Role.Admin, Role.Superadmin),catchAsync(AuthController.getAllUsers));
router.route("/user/:id")
.get(auth.isAuthenticated,auth.restrictTo(Role.Admin, Role.Superadmin),catchAsync(AuthController.getUserById))
.put(auth.isAuthenticated,auth.restrictTo(Role.Admin, Role.Superadmin, Role.User),upload.single("profileImage"),catchAsync(AuthController.updateUserById))
.delete(auth.isAuthenticated,auth.restrictTo(Role.Admin, Role.Superadmin),catchAsync(AuthController.deleteUserById));


export default router;
