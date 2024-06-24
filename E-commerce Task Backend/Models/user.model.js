import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      minLength: [3, "Name contains at least 3 characters"],
      maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: Number,
      // required: [true, "Please provide your phone number"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [8, "Password contains at least 8 characters"],
      maxLength: [32, "Password cannot exceed 32 characters"],
    },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

// Hashing the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// Compare the password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT token
userSchema.methods.generateJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Remove password and refresh token from the output
export const User = mongoose.model("User", userSchema);
