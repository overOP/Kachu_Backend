import Product from "../database/models/products.model";
import Category from "../database/models/category.model";
import Factory from "../database/models/factory.model";
import { Op } from "sequelize";

export const createProductService = async (
  body: any,
  files: Express.Multer.File[],
  userId: string,
) => {
  const category = await Category.findByPk(body.categoryId);
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  // const factory = await Factory.findByPk(body.factoryId);
  // if (!factory) throw new Error("FACTORY_NOT_FOUND");

  const productImages = files?.map((file) => file.filename) || [];

  return Product.create({
    productName: body.productName,
    productDescription: body.productDescription,
    productPrice: body.productPrice,
    minimumOrderQty: body.minimumOrderQty,
    deliveryTime: body.deliveryTime,
    productImages,
    categoryId: category.id,
    // factoryId: factory.id,
    createdBy: userId,
  });
};

export const getAllProductsService = async () => {
  return Product.findAll({
    include: [{ model: Category, attributes: ["categoryName"] }],
    order: [["createdAt", "DESC"]],
  });
};

export const getProductByIdService = async (id: number) => {
  return Product.findByPk(id, {
    include: [{ model: Category, attributes: ["categoryName"] }],
  });
};

export const getProductsByCategoryService = async (categoryId: number) => {
  return Product.findAll({
    where: { categoryId },
    include: [{ model: Category, attributes: ["categoryName"] }],
  });
};

export const searchProductsService = async (query: string) => {
  return Product.findAll({
    where: {
      productName: {
        [Op.like]: `%${query}%`,
      },
    },
    include: [{ model: Category, attributes: ["categoryName"] }],
  });
};

export const updateProductService = async (
  id: number,
  body: any,
  files?: Express.Multer.File[],
) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  if (body.categoryId) {
    const category = await Category.findByPk(body.categoryId);
    if (!category) throw new Error("CATEGORY_NOT_FOUND");
  }

  if (body.factoryId) {
    const factory = await Factory.findByPk(body.factoryId);
    if (!factory) throw new Error("FACTORY_NOT_FOUND");
  }

  if (files && files.length > 0) {
    body.productImages = files.map((f) => f.filename);
  }

  await product.update(body);
  return product;
};

export const deleteProductService = async (id: number) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  await product.destroy();
};
