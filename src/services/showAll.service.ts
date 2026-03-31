import Factory from "../database/models/factory.model";
import Product from "../database/models/products.model";

export const getALlFactoryProductService = async () => {
  const factory = await Factory.findAll({
    include: [Product],
    order: [["createdAt", "DESC"]],
  });

  console.log(factory);
  return factory;
};
