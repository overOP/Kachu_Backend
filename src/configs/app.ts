import express from "express";
import cors from "cors";
import auth from "../routes/auth.route";
import product from "../routes/product.route";
import category from "../routes/category.route";
import factory from "../routes/factorie.route";
export class App {
  public app = express();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
    }));
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use("/api/users",auth);
    this.app.use("/api/products",product);
    this.app.use("/api/categories",category);
    this.app.use("/api/factories",factory);
  }
}