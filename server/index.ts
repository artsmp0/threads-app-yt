import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./db/connectDB";
import userRouter from "./router/userRouter";
import postRouter from "./router/postRouter";
import messageRouter from "./router/messageRouter";
import { app, server } from "./socket";

dotenv.config();
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
