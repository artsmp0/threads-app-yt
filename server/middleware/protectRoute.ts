import jwt from "jsonwebtoken";
import User from "../model/userModel";
import { Request } from "express";

export const protectRoute = async (req: Request, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user!;
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};
