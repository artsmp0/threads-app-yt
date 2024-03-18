import Post from "../model/postModel.js";
import User from "../model/userModel.js";

export const create = async (req, res) => {
  try {
    const { text, img, postedBy } = req.body;

    if (!postedBy || !text) return res.status(400).json({ message: "postedBy and text fields are required." });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLen = 500;
    if (text.length > maxLen) {
      return res.status(400).json({ message: `Text must be less than ${maxLen} characters.` });
    }

    const newPost = new Post({ text, img, postedBy });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete post" });
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });
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
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const reply = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.name;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    res.status(200).json({ message: "Reply added successfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

export const feed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
    res.status(200).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(123, err);
  }
};
