import { asyncHandler } from "../Middlewares/CatchAsyncError.middleware.js";
import APIError from "../Middlewares/APIError.middlware.js";
import { User } from "../Models/user.model.js";
import { sendToken } from "../Utils/jwtToken.js";
import { Cart } from "../Models/cart.model.js";

// Register a new user
export const register = asyncHandler(async (req, res, next) => {
  // Get the user data from the request body
  const { name, email, phone, password, address } = req.body;
  if (!name || !email || !password) {
    throw new APIError(400, "All fields are required");
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError(409, "User already existed with this email or username");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    address,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new APIError(500, "Something went wrong while registering the user");

  const cart = await Cart.create({
    userId: createdUser._id,
    items: [],
  });

  if (!cart) {
    throw new APIError(500, "Something went wrong while creating the cart");
  }

  sendToken(createdUser, 201, res, "User registered successfully");
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, "User not found");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new APIError(404, "Invalid email or password");
  }

  sendToken(user, 200, res, "User logged in successfully");
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUser = asyncHandler((req, res, next) => {
  const user = req.user;
  sendToken(user, 200, res, "User fetched successfully");
});
