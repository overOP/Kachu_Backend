import express, { Router } from "express";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import { multer, storage } from "../middleware/multer";
import productController from "../controllers/product.controller";
import { Role } from "../enum/auth.enum";

const upload = multer({ storage });
const router: Router = express.Router();

router.get("/", catchAsync(productController.getAllProducts));

router.get("/search", catchAsync(productController.searchProducts));

router.get(
  "/category/:categoryId",
  catchAsync(productController.getProductsByCategory),
);

router.get("/:id", catchAsync(productController.getProductById));
router.post(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  upload.array("productImages", 5),
  catchAsync(productController.addProduct),
);

router.put(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  upload.array("productImages", 5),
  catchAsync(productController.updateProduct),
);

router.delete(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(productController.deleteProduct),
);

export default router;
