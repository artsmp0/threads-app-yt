import { Request, Response } from "express";
import Post from "../model/postModel";
import User from "../model/userModel";
import { v2 as cloudinary } from "cloudinary";

export const create = async (req: Request, res: Response) => {
  try {
    const { text, postedBy } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) return res.status(400).json({ error: "postedBy and text fields are required." });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user._id.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLen = 500;
    if (text.length > maxLen) {
      return res.status(400).json({ error: `Text must be less than ${maxLen} characters.` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ text, img, postedBy });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.status(200).json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    if (post.postedBy.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }
    if (post.img) {
      const imageId = post.img.split("/").pop()?.split(".")[0] ?? "";
      await cloudinary.uploader.destroy(imageId);
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const like = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user!._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });
    const isUserLiked = post.likes.includes(userId);
    if (isUserLiked) {
      // unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully." });
    } else {
      // like
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const reply = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user!._id;
    const userProfilePic = req.user!.profilePic;
    const username = req.user!.name;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const feed = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
    res.status(200).json(feedPosts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
