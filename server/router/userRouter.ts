import express from "express";
import { signup, login, logout, update, follow, profile } from "../controller/userController";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

router.get("/profile/:query", profile);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update/:id", protectRoute, update);
router.post("/follow/:id", protectRoute, follow);

export default router;
