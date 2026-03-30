import Factory from "../database/models/factory.model";
import PageFactory from "../database/models/pageFactory.model";
import Product from "../database/models/products.model";

export const addpageFactorieService = async (
  factoryBannerImage: string,
  factoryName: string,
  factoryDescription: string,
  factoryImages: string,
  factoryLocationImage: string,
  factoryLocation: string,
  productId: Number,
  factoryId: Number,
) => {
  const addProducts = await PageFactory.create({
    factoryBannerImage,
    factoryName,
    factoryDescription,
    factoryImages,
    factoryLocationImage,
    factoryLocation,
    productId,
    factoryId,
  });
  console.log(addProducts);
  return addProducts;
};

export const getAllPageFctoriesService = async () => {
  return await PageFactory.findAll({
    include: [
      { model: Product, attributes: ["id", "productName"] },
      { model: Factory, attributes: ["id", "factoryName"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};
