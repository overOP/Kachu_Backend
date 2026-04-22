import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Product from "./products.model";

@Table({
  tableName: "categories",
  modelName: "Category",
  timestamps: true,
})
class Category extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
  })
  declare categoryName: string;

  @HasMany(() => Product)
  declare products: Product[];
}

export default Category;