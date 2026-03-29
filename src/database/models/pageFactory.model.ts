import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import Product from "./products.model";
import Factory from "./factory.model";

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
  declare factoryBannerImage: string;

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
    type: DataType.JSON,
    allowNull: true,
  })
  declare factoryImages: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare factoryLocationImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare factoryLocationUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare factoryLocation: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: Product;

  @ForeignKey(() => Factory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare factoryId: number;
  @BelongsTo(() => Factory)
  declare factory: Factory;
}

export default PageFactory;
