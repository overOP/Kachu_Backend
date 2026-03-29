import bcrypt from "bcrypt";
import User from "../database/models/user.model";

const adminSeed = async () => {
  const {
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD,
    BCRYPT_SALT_ROUNDS,
    SUPER_ADMIN_ROLE,
  } = process.env;

  if (
    !SUPER_ADMIN_NAME ||
    !SUPER_ADMIN_EMAIL ||
    !SUPER_ADMIN_PASSWORD ||
    !SUPER_ADMIN_ROLE
  ) {
    throw new Error("❌ Missing admin environment variables");
  }

  const existingAdmin = await User.findOne({
    where: { email: SUPER_ADMIN_EMAIL },
  });

  const saltRounds = Number(BCRYPT_SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, saltRounds);
  if (!existingAdmin) {
    await User.create({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: SUPER_ADMIN_ROLE,
    });
    console.log("✅ Super Admin user created successfully");
  } else {
    console.log("ℹ️  Super Admin already exists, skipping creation");
  }
};

export default adminSeed;
