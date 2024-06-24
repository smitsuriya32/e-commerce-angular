import { asyncHandler } from "../Middlewares/CatchAsyncError.middleware.js";
import { Product } from "../Models/product.model.js";
import APIError from "../Middlewares/APIError.middlware.js";
import { APIResponse } from "../Middlewares/APIResponse.middleware.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res
    .status(200)
    .json(new APIResponse(200, products, "Fetched All Products Successfully."));
});

export const getProductById = asyncHandler(async (req, res, next) => {
  if (!req.params.id) throw new APIError(400, "Product ID is required.");

  if (mongoose.Types.ObjectId.isValid(req.params.id) === false)
    throw new APIError(400, "Invalid Product ID.");

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new APIError(404, "Product not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, product, "Fetched Product Successfully."));
});

export const addProduct = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new APIError(400, "Product Image File Required!"));
  }

  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(
      new APIError(400, "Invalid file type. Please upload a PNG file.")
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    image.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new APIError(500, "Failed to upload image to Cloudinary"));
  }

  const { name, description, price } = req.body;

  if (!name || !description || !price || !image) {
    return next(new APIError(400, "Please fill all fields."));
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res
    .status(200)
    .json(new APIResponse(200, product, "Product Added Successfully"));
});
