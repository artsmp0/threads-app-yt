import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { create, getPost, deletePost, like, reply, feed, getUserPosts } from "../controller/postController";

const router = express.Router();

router.get("/feed", protectRoute, feed); // this could place before /:id
router.post("/create", protectRoute, create);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, like);
router.put("/reply/:id", protectRoute, reply);
export default router;
