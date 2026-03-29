import Factory from "../database/models/factory.model";
import PageFactory from "../database/models/pageFactory.model";
import Product from "../database/models/products.model";

export const getAllPageFctoriesService = async () => {
  return await PageFactory.findAll({
    include: [
      { model: Product, attributes: ["id", "productName"] },
      { model: Factory, attributes: ["id", "factoryName"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};
