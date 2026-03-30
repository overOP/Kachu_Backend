import express, { Router } from "express";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import { multer, storage } from "../middleware/multer";
import FactoryController from "../controllers/factorie.controller";
import { Role } from "../enum/auth.enum";

const router: Router = express.Router();
const upload = multer({ storage });

router.post(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  upload.single("factoryImage"),
  catchAsync(FactoryController.addFactory),
);

router.get("/", catchAsync(FactoryController.getAllFactories));

router.get("/:factoryName", catchAsync(FactoryController.getFactoryByName));

router.put(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  upload.single("factoryImage"),
  catchAsync(FactoryController.updateFactory),
);

router.delete(
  "/:id",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(FactoryController.deleteFactory),
);

export default router;
