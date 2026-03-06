import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Category from "./category.model";
import User from "./user.model";
import Factory from "./factory.model";
import PageFactory from "./pageFactory.model";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare productDescription: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare productPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare minimumOrderQty: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare productImages?: string[] | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deliveryTime?: string | null;

  @ForeignKey(() => Factory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare factoryId: number;

  @BelongsTo(() => Factory)
  declare factory: Factory;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare categoryId: number;

  @BelongsTo(() => Category)
  declare category: Category;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare createdBy: string;

  @BelongsTo(() => User, { foreignKey: "createdBy" })
  declare creator: User;

  @HasMany(() => PageFactory)
  declare pageFactories: PageFactory[];
}

export default Product;
