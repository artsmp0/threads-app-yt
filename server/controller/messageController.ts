import { Request, RequestHandler, Response } from "express";
import Conversation from "../model/conversationModel";
import Message from "../model/messageModel";
import { getSocketId, io } from "../socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user?._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, recipientId],
      },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const socketId = getSocketId(recipientId);
    if (socketId) {
      io.to(socketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user?._id;
    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, otherUserId],
      },
    });
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({ path: "participants", select: "username profilePic" });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter((participants) => participants._id.toString() !== userId?.toString());
    });
    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
