import express, { Router } from "express";
import catchAsync from "../utils/catchAsync";
import auth from "../middleware/authenticate.guard";
import { multer, storage } from "../middleware/multer";

const router: Router = express.Router();
const upload = multer({ storage });


export default router;