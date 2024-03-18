import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { create, getPost, deletePost, like, reply, feed } from "../controller/postController.js";

const router = express.Router();

router.get("/feed", protectRoute, feed); // this could place before /:id
router.post("/create", protectRoute, create);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, like);
router.post("/reply/:id", protectRoute, reply);
export default router;
