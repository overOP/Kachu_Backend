import express, { Router } from "express";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import CategoryController from "../controllers/categorie.controller";
import { Role } from "../enum/auth.enum";

const router: Router = express.Router();

router.get(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(CategoryController.getAllCategories)
);

router.get(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(CategoryController.getCategoryById)
);

router.post(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(CategoryController.addCategory)
);

router.put(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(CategoryController.updateCategory)
);

router.delete(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(CategoryController.deleteCategory)
);

export default router;