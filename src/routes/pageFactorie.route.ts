import express, { Router } from "express";
import auth from "../middleware/authenticate.guard";
import catchAsync from "../utils/catchAsync";
import pageFactoryController from "../controllers/pageFactorie.controller";
import { Role } from "../enum/auth.enum";
import multer from "multer";
import { storage } from "../middleware/multer";

const upload = multer({ storage });
const router: Router = express.Router();

router.post(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  upload.fields([
    { name: "factoryBannerImage", maxCount: 1 },
    { name: "factoryImages", maxCount: 5 },
    { name: "factoryLocationImage", maxCount: 5 },
  ]),

  catchAsync(pageFactoryController.addpageFactorie),
);

router.get(
  "/",
  auth.isAuthenticated,
  auth.restrictTo(Role.Admin, Role.Superadmin),
  catchAsync(pageFactoryController.getAllPageFactory),
);

export default router;
