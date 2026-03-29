import express, { Router } from "express";
import auth from "../middleware/authenticate.guard";
import catchAsync from "../utils/catchAsync";
import pageFactoryController from "../controllers/pageFactorie.controller";

const router: Router = express.Router();

router.get(
  "/",
  auth.isAuthenticated,
  catchAsync(pageFactoryController.getAllPageFactory),
);

export default router;
