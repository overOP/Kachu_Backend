import User from "../database/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { UniqueConstraintError } from "sequelize";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp, hashOtp, isOtpExpired } from "../utils/otpUtils";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);
const OTP_LENGTH = Number(process.env.OTP_LENGTH);
const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN);
const OTP_RESEND_COOLDOWN_SEC = Number(process.env.OTP_RESEND_COOLDOWN_SEC);
const OTP_MAX_RESENDS = Number(process.env.OTP_MAX_RESENDS);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS);
const RESET_TOKEN_EXPIRES_MIN = Number(process.env.OTP_RESET_TOKEN_EXPIRES_MIN);

export const deleteFile = async (fileName?: string | null) => {
  if (!fileName) return;
  const filePath = path.join(process.cwd(), "uploads", fileName);
  await fs.unlink(filePath).catch(() => {});
};

export const registerUserService = async (
  name: string,
  email: string,
  password: string,
) => {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error("USER_EXISTS");

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await User.create({ name, email, password: hashed });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new Error("USER_EXISTS");
    }
    throw err;
  }
};

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("INVALID_EMAIL");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("INVALID_PASSWORD");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "30d" },
  );
  console.log("JWT:", token);
  console.log("JWT:", process.env.JWT_SECRET);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const now = Date.now();
  if (user.otpLastSentAt) {
    const last = new Date(user.otpLastSentAt).getTime();
    if (now - last < OTP_RESEND_COOLDOWN_SEC * 1000) {
      throw new Error("OTP_COOLDOWN");
    }
  }

  if ((user.otpResendCount || 0) >= OTP_MAX_RESENDS) {
    throw new Error("OTP_LIMIT");
  }

  const otp = generateOtp(OTP_LENGTH);
  user.passwordOtp = hashOtp(otp);
  user.passwordOtpExpiresAt = new Date(
    Date.now() + OTP_EXPIRES_MIN * 60 * 1000,
  );
  user.otpLastSentAt = new Date();
  user.otpResendCount = (user.otpResendCount || 0) + 1;
  user.otpAttempts = 0;
  user.isOtpVerified = false;

  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Password Reset OTP",
    message: `Your OTP is ${otp}`,
  });
};

export const verifyOtpService = async (email: string, otp: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!user.passwordOtp || !user.passwordOtpExpiresAt) {
    throw new Error("NO_OTP_REQUESTED");
  }

  if ((user.otpAttempts || 0) >= OTP_MAX_ATTEMPTS) {
    user.passwordOtp = null;
    user.passwordOtpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    throw new Error("OTP_ATTEMPTS_EXCEEDED");
  }

  if (isOtpExpired(user.passwordOtpExpiresAt)) {
    user.passwordOtp = null;
    user.passwordOtpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    throw new Error("OTP_EXPIRED");
  }

  const hashedProvided = hashOtp(String(otp));
  if (hashedProvided !== user.passwordOtp) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    await user.save();

    const attemptsLeft = OTP_MAX_ATTEMPTS - (user.otpAttempts || 1);

    throw new Error(`OTP_INVALID:${attemptsLeft}`);
  }

  user.isOtpVerified = true;
  user.passwordOtp = null;
  user.passwordOtpExpiresAt = null;
  user.otpAttempts = 0;
  await user.save();

  const resetToken = jwt.sign(
    { id: user.id, type: "otp_reset" },
    process.env.JWT_SECRET as string,
    { expiresIn: `${RESET_TOKEN_EXPIRES_MIN}m` },
  );

  return resetToken;
};

export const resetPasswordService = async (
  resetToken: string,
  newPassword: string,
) => {
  let payload: any;

  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET as string);
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  if (!payload || payload.type !== "otp_reset" || !payload.id) {
    throw new Error("INVALID_TOKEN");
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = hashedPassword;

  user.passwordOtp = null;
  user.passwordOtpExpiresAt = null;
  user.otpLastSentAt = null;
  user.otpResendCount = 0;
  user.otpAttempts = 0;
  user.isOtpVerified = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password has been changed",
      message:
        "This is a confirmation that your account password was successfully changed. If this was not you, please contact support immediately.",
    });
  } catch (err) {
    console.error("❌ Password reset email failed:", err);
  }
};

export const getAllUsersService = async () => {
  const users = await User.findAll({
    attributes: {
      exclude: [
        "password",
        "otp",
        "otpExpiry",
        "otpAttempts",
        "otpRequestTime",
        "createdAt",
        "updatedAt",
      ],
    },
  });
  return users;
};

export const getUserByIdService = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

export const updateUserByIdService = async (id: string, data: any) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (data.profileImage && user.profileImage) {
    await deleteFile(user.profileImage);
  }

  user.set(data);
  await user.save();

  return user;
};

export const deleteUserByIdService = async (id: string) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.profileImage) {
    await deleteFile(user.profileImage);
  }

  await user.destroy();

  return user;
};
