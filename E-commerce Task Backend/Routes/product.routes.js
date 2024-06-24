import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
} from "../Controllers/product.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";

const productRouter = express.Router();

// productRouter.use(verifyJWT);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProductById/:id", getProductById);
productRouter.post("/addProduct", addProduct);

export default productRouter;
