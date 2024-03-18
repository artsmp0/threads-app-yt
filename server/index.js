import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./controller/connectDB.js";
import userRouter from "./router/userRouter.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
