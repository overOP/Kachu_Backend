import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate.guard";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  getProductsByCategoryService,
  searchProductsService,
  updateProductService,
  deleteProductService,
} from "../services/product.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";

class ProductController {
  async addProduct(req: AuthRequest, res: Response) {
    try {
      const product = await createProductService(
        req.body,
        req.files as Express.Multer.File[],
        req.user!.id,
      );

      return sendSuccessResponse(
        res,
        "Product added successfully",
        product,
        201,
      );
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }

  async getAllProducts(req: AuthRequest, res: Response) {
    const products = await getAllProductsService();
    return sendSuccessResponse(res, "Products fetched", products, 200);
  }

  async getProductById(req: AuthRequest, res: Response) {
    const product = await getProductByIdService(Number(req.params.id));
    if (!product) return sendErrorResponse(res, "Product not found", 404);

    return sendSuccessResponse(res, "Product fetched", product, 200);
  }

  async getProductsByCategory(req: AuthRequest, res: Response) {
    const products = await getProductsByCategoryService(
      Number(req.params.categoryId),
    );
    return sendSuccessResponse(res, "Products fetched", products, 200);
  }

  async searchProducts(req: AuthRequest, res: Response) {
    const { q } = req.query;
    if (!q) return sendErrorResponse(res, "Search query required", 400);

    const products = await searchProductsService(String(q));
    return sendSuccessResponse(res, "Search results", products, 200);
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const product = await updateProductService(
        Number(req.params.id),
        req.body,
        req.files as Express.Multer.File[],
      );

      return sendSuccessResponse(res, "Product updated", product, 200);
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      await deleteProductService(Number(req.params.id));
      return sendSuccessResponse(res, "Product deleted", {}, 200);
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }
}

export default new ProductController();
