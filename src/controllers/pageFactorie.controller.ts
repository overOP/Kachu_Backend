import { Request, Response } from "express";
import {
  addpageFactorieService,
  getAllPageFctoriesService,
} from "../services/pageFactorie.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";

class pageFactoryController {
  static async addpageFactorie(req: Request, res: Response) {
    const {
      factoryBannerImage,
      factoryName,
      factoryDescription,
      factoryImages,
      factoryLocationImage,
      factoryLocation,
      productId,
      factoryId,
    } = req.body;
    try {
      const result = await addpageFactorieService(
        factoryBannerImage,
        factoryName,
        factoryDescription,
        factoryImages,
        factoryLocationImage,
        factoryLocation,
        productId,
        factoryId,
      );
      return sendSuccessResponse(
        res,
        "PageFactorie added successfully",
        result,
        200,
      );
    } catch (err: any) {
      return sendErrorResponse(res, "Error adding pageFactorie", 400);
    }
  }

  static async getAllPageFactory(req: Request, res: Response) {
    const result = await getAllPageFctoriesService();
    return sendSuccessResponse(
      res,
      "Details fetched successfully",
      result,
      200,
    );
  }
}
export default pageFactoryController;
