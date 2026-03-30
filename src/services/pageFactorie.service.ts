import Factory from "../database/models/factory.model";
import { deleteFile } from "../utils/fileHelper";
import { Op } from "sequelize";

export const createPageFactoryService = async (
  factoryName: string,
  file?: Express.Multer.File
) => {
  const exists = await Factory.findOne({ where: { factoryName } });
  if (exists) throw new Error("FACTORY_ALREADY_EXISTS");

  return Factory.create({
    factoryName,
    factoryImage: file ? file.filename : null,
  });
};

export const getAllFactoriesService = async () => {
  return Factory.findAll({ order: [["factoryName", "ASC"]] });
};

export const getFactoryByNameService = async (factoryName: string) => {
  return Factory.findOne({ where: { factoryName } });
};

export const updateFactoryService = async (
  id: number,
  factoryName?: string,
  file?: Express.Multer.File
) => {
  const factory = await Factory.findByPk(id);
  if (!factory) throw new Error("FACTORY_NOT_FOUND");

  if (factoryName) {
    const exists = await Factory.findOne({
      where: { factoryName, id: { [Op.ne]: id } },
    });
    if (exists) throw new Error("FACTORY_ALREADY_EXISTS");

    factory.factoryName = factoryName;
  }

  if (file) {
    if (factory.factoryImage) await deleteFile(factory.factoryImage);
    factory.factoryImage = file.filename;
  }

  await factory.save();
  return factory;
};

export const deleteFactoryService = async (id: number) => {
  const factory = await Factory.findByPk(id);
  if (!factory) throw new Error("FACTORY_NOT_FOUND");

  if (factory.factoryImage) await deleteFile(factory.factoryImage);

  await factory.destroy();
};