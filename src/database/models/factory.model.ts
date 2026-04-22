import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Product from "./products.model";

@Table({
  tableName: "factories",
  modelName: "Factory",
  timestamps: true,
})
class Factory extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare factoryName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare factoryImage?: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: Product;

  // @HasMany(() => Product)
  // declare products: Product[];
}

export default Factory;