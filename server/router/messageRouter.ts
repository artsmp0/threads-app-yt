import express from "express";
import { getConversations, getMessages, sendMessage } from "../controller/messageController";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
