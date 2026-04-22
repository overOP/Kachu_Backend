import { Request, Response } from "express";
import { getALlFactoryProductService } from "../services/showAll.service";
import { sendSuccessResponse } from "../utils/responseHelper";

class showAllcontroller {
  static async getALlFactoryProduct(req: Request, res: Response) {
    const result = await getALlFactoryProductService();
    console.log(result);
    return sendSuccessResponse(res, "Data fetched sucessfully", result, 200);
  }
}

export default showAllcontroller;