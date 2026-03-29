import { Request, Response } from "express";
import { getAllPageFctoriesService } from "../services/pageFactorie.service";
import { sendSuccessResponse } from "../utils/responseHelper";

class pageFactoryController {
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
