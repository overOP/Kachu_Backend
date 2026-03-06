import { Request, Response } from "express";
import { Op } from "sequelize";
import Factory from "../database/models/factory.model";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responseHelper";
import { deleteFile } from "../utils/fileHelper";

class FactoryController {
  // ================= CREATE =================
  async addFactory(req: Request, res: Response) {
    const { factoryName } = req.body;

    // Check if factory already exists
    const exists = await Factory.findOne({ where: { factoryName } });
    if (exists) {
      return sendErrorResponse(res, "Factory already exists", 400);
    }

    const file = req.file as Express.Multer.File | undefined;

    const factory = await Factory.create({
      factoryName,
      factoryImage: file ? file.filename : null,
    });

    return sendSuccessResponse(res, "Factory created", factory, 201);
  }

  // ================= READ =================
  async getAllFactories(req: Request, res: Response) {
    const factories = await Factory.findAll({
      attributes: ["id", "factoryName", "factoryImage"],
      order: [["factoryName", "ASC"]],
    });

    return sendSuccessResponse(res, "Factories fetched", factories, 200);
  }

  async getFactoryByName(req: Request, res: Response) {
    const { factoryName } = req.params;

    const factory = await Factory.findOne({ where: { factoryName } });
    if (!factory) {
      return sendErrorResponse(res, "Factory not found", 404);
    }

    return sendSuccessResponse(res, "Factory fetched", factory, 200);
  }

  // ================= UPDATE =================
  async updateFactory(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return sendErrorResponse(res, "Invalid factory ID", 400);
    }

    const factory = await Factory.findByPk(id);
    if (!factory) {
      return sendErrorResponse(res, "Factory not found", 404);
    }

    const { factoryName } = req.body;

    if (factoryName) {
      const exists = await Factory.findOne({
        where: {
          factoryName,
          id: { [Op.ne]: id },
        },
      });

      if (exists) {
        return sendErrorResponse(res, "Factory already exists", 400);
      }

      factory.factoryName = factoryName;
    }

    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      if (factory.factoryImage) {
        await deleteFile(factory.factoryImage);
      }
      factory.factoryImage = file.filename;
    }

    await factory.save();

    return sendSuccessResponse(res, "Factory updated", factory, 200);
  }

  // ================= DELETE =================
  async deleteFactory(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return sendErrorResponse(res, "Invalid factory ID", 400);
    }

    const factory = await Factory.findByPk(id);
    if (!factory) {
      return sendErrorResponse(res, "Factory not found", 404);
    }

    if (factory.factoryImage) {
      await deleteFile(factory.factoryImage);
    }

    await factory.destroy();

    return sendSuccessResponse(res, "Factory deleted", {}, 200);
  }
}

export default new FactoryController();