import APIError from "../Middlewares/APIError.middlware.js";
import { asyncHandler } from "../Middlewares/CatchAsyncError.middleware.js";
import { APIResponse } from "../Middlewares/APIResponse.middleware.js";
import { Cart } from "../Models/cart.model.js";
import mongoose from "mongoose";

export const getMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId"
  );

  if (!cart) {
    throw new APIError(404, "Cart not found");
  }

  res.status(200).json(new APIResponse(200, cart, "Cart fetched successfully"));
});

// Add to Cart
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, userId } = req.body;
  if (!productId) throw new APIError(400, "Product ID is required.");

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new APIError(400, "Invalid Product ID.");

  const cart = await Cart.findOne({ userId });

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    item.quantity++;
    cart.items[itemIndex] = item;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ userId }).populate(
    "items.productId"
  );

  res
    .status(200)
    .json(new APIResponse(200, updatedCart, "Item added to cart successfully"));
});

// Remove from Cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) throw new APIError(400, "Product ID is required.");

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new APIError(400, "Invalid Product ID.");

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    throw new APIError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items.splice(itemIndex, 1); // Remove item from cart
    } else {
      cart.items[itemIndex] = item; // Update item quantity
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items.productId",
    });

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          updatedCart,
          "Item quantity decremented or removed successfully"
        )
      );
  } else {
    throw new APIError(404, "Item not found in cart");
  }
});

// Clear Cart
export const clearCart = asyncHandler(async (req, res, next) => {
  //empty the items array in the cart
  await Cart.updateOne({ userId: req.user.id }, { items: [] });
  res.status(200).json(new APIResponse(200, null, "Cart cleared successfully"));
});
