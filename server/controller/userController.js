import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { genTokenAndSetCookie } from "../util/genTokenAndSetCookie.js";

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  if (newUser) {
    genTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    });
  } else {
    res.status(400).json({ message: "Invalid user data." });
  }
};
