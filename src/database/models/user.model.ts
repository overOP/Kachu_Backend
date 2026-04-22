import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasMany,
} from "sequelize-typescript";
import Product from "./products.model";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: process.env.DEFAULT_AVATAR,
  })
  declare profileImage: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare number: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare address: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dateOfBirth: Date | null;

  @Column({
    type: DataType.ENUM("male", "female", "other"),
    allowNull: true,
  })
  declare gender: "male" | "female" | "other" | null;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("user", "admin", "superadmin"),
    defaultValue: "user",
  })
  declare role: "user" | "admin" | "superadmin";

  @Column({
    type: DataType.STRING(128),
    allowNull: true,
  })
  declare passwordOtp?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare passwordOtpExpiresAt?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare otpLastSentAt?: Date | null;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare otpResendCount: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare otpAttempts: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isOtpVerified: boolean;

  @HasMany(() => Product, { foreignKey: "createdBy" })
  declare products: Product[];
}

export default User;