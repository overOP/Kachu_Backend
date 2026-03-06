import { Request, Response } from "express";
import {
  registerUserService,
  loginUserService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} from "../services/auth.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";
import { checkRequiredFields } from "../utils/validateFields";

class AuthController {
  static async registerUser(req: Request, res: Response) {
    if (!checkRequiredFields(req.body, ["name", "email", "password"], res))
      return;

    try {
      const user = await registerUserService(
        req.body.name,
        req.body.email,
        req.body.password,
      );

      return sendSuccessResponse(
        res,
        "User registered successfully",
        { name: user.name, email: user.email },
        201,
      );
    } catch (err: any) {
      if (err.message === "USER_EXISTS") {
        return sendErrorResponse(res, "User already exists", 409);
      }
      return sendErrorResponse(res, "Registration failed", 500);
    }
  }

  static async loginUser(req: Request, res: Response) {
    if (!checkRequiredFields(req.body, ["email", "password"], res)) return;

    try {
      const result = await loginUserService(req.body.email, req.body.password);
      return sendSuccessResponse(res, "Login successful", result, 200);
    } catch (err: any) {
      if (err.message === "INVALID_EMAIL") {
        return sendErrorResponse(res, "Invalid email", 401);
      }
      if (err.message === "INVALID_PASSWORD") {
        return sendErrorResponse(res, "Invalid password", 401);
      }
      return sendErrorResponse(res, "Login failed", 500);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    if (!checkRequiredFields(req.body, ["email"], res)) return;

    try {
      await forgotPasswordService(req.body.email);
      return sendSuccessResponse(res, "OTP sent successfully", {}, 200);
    } catch (err: any) {
      if (err.message === "OTP_COOLDOWN") {
        return sendErrorResponse(res, "Please wait before retrying", 429);
      }
      if (err.message === "OTP_LIMIT") {
        return sendErrorResponse(res, "OTP limit reached", 429);
      }
      return sendErrorResponse(res, "Failed to send OTP", 500);
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    if (!checkRequiredFields(req.body, ["email", "otp"], res)) return;

    try {
      const resetToken = await verifyOtpService(req.body.email, req.body.otp);

      return sendSuccessResponse(
        res,
        "OTP verified successfully",
        { resetToken },
        200,
      );
    } catch (err: any) {
      if (err.message === "USER_NOT_FOUND") {
        return sendErrorResponse(res, "User not found", 404);
      }

      if (err.message === "NO_OTP_REQUESTED") {
        return sendErrorResponse(
          res,
          "No OTP requested. Please request an OTP first.",
          400,
        );
      }

      if (err.message === "OTP_EXPIRED") {
        return sendErrorResponse(
          res,
          "OTP has expired. Please request a new OTP.",
          400,
        );
      }

      if (err.message === "OTP_ATTEMPTS_EXCEEDED") {
        return sendErrorResponse(
          res,
          "Too many failed attempts. Please request a new OTP.",
          429,
        );
      }

      if (err.message.startsWith("OTP_INVALID")) {
        const attemptsLeft = err.message.split(":")[1];
        return sendErrorResponse(
          res,
          `Invalid OTP. Attempts left: ${attemptsLeft}`,
          401,
        );
      }

      return sendErrorResponse(res, "OTP verification failed", 500);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    if (
      !checkRequiredFields(
        req.body,
        ["resetToken", "newPassword", "confirmPassword"],
        res,
      )
    ) {
      return;
    }

    const { resetToken, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return sendErrorResponse(
        res,
        "New password and confirm password do not match",
        400,
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return sendErrorResponse(
        res,
        "Password must be at least 6 characters long",
        400,
      );
    }

    try {
      await resetPasswordService(resetToken, newPassword);
      return sendSuccessResponse(res, "Password reset successful", {}, 200);
    } catch (err: any) {
      if (err.message === "INVALID_TOKEN") {
        return sendErrorResponse(res, "Invalid or expired reset token", 401);
      }

      if (err.message === "USER_NOT_FOUND") {
        return sendErrorResponse(res, "User not found", 404);
      }

      return sendErrorResponse(res, "Failed to reset password", 500);
    }
  }
}

export default AuthController;
