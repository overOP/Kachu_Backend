import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate.guard";
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categorie.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper";

class CategoryController {
  async getAllCategories(req: AuthRequest, res: Response) {
    const categories = await getAllCategoriesService();
    return sendSuccessResponse(res, "Categories fetched", categories, 200);
  }

  async getCategoryById(req: AuthRequest, res: Response) {
    const category = await getCategoryByIdService(Number(req.params.id));
    if (!category) return sendErrorResponse(res, "Category not found", 404);

    return sendSuccessResponse(res, "Category fetched", category, 200);
  }

  async addCategory(req: AuthRequest, res: Response) {
    try {
      const { categoryName } = req.body;
      const category = await createCategoryService(categoryName);
      return sendSuccessResponse(res, "Category added", category, 201);
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }

  async updateCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;
      const category = await updateCategoryService(Number(id), categoryName);
      return sendSuccessResponse(res, "Category updated", category, 200);
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }

  async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const category = await deleteCategoryService(Number(id));
      return sendSuccessResponse(res, "Category deleted", category, 200);
    } catch (err: any) {
      return sendErrorResponse(res, err.message, 400);
    }
  }
}

export default new CategoryController();