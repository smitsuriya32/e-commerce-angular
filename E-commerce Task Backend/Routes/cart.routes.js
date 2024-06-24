import express from "express";
import {
  addToCart,
  clearCart,
  getMyCart,
  removeFromCart,
} from "../Controllers/cart.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";

const cartRouter = express.Router();

cartRouter.use(verifyJWT);
cartRouter.get("/getMyCart", getMyCart);
cartRouter.post("/addToCart", addToCart);
cartRouter.get("/removeFromCart/:id", removeFromCart);
cartRouter.post("/clearCart", clearCart);

export default cartRouter;
