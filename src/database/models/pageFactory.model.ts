import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Product from "./products.model";

@Table({
  tableName: "pageFactories",
  modelName: "PageFactory",
  timestamps: true,
})
class PageFactory extends Model {
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
  declare factoryName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare factoryDescription: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare factoryPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare minimumOrderQty: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare factoryImages: string[];

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: Product;
}

export default PageFactory;
