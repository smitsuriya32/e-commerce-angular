import express, { urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./Routes/user.routes.js";
import productRouter from "./Routes/product.routes.js";
import { errorMiddleware } from "./Middlewares/APIError.middlware.js";
import cartRouter from "./Routes/cart.routes.js";

const app = express();

config({
  path: "./config/config.env",
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL_REACT, process.env.FRONTEND_URL_ANGULAR],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);

app.use(errorMiddleware);

export default app;
