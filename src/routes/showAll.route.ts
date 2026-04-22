import express, { Router } from "express";
import auth from "../middleware/authenticate.guard";
import showAllcontroller from "../controllers/showAll.controller";
import catchAsync from "../utils/catchAsync";

const router: Router = express.Router();

router.get(
  "/",
  auth.isAuthenticated,
  catchAsync(showAllcontroller.getALlFactoryProduct),
);

export default router;