// controllers/likeController.js
import Like from "../models/Like.model.js";
import Blog from "../models/Blog.model.js";
import Notification from "../models/Notification.model.js";
import Activity from "../models/Activity.model.js";

export const likeBlog = async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    // Check if already liked
    const existingLike = await Like.findOne({ blogId, userId });
    if (existingLike) {
      return res.status(400).json({ error: "Already liked" });
    }

    // Create like
    const like = new Like({ blogId, userId });
    await like.save();

    // Log activity
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const activity = await Activity.create({
      userId,
      type: "LIKE",
      targetId: like._id,
      metadata: { blogTitle: blog.title },
    });

    // Notify author
    if (userId.toString() !== blog.authorId.toString()) {
      await Notification.create({
        userId: blog.authorId,
        message: `Your blog "${blog.title}" was liked.`,
        activityId: activity._id,
      });
    }

    res.status(201).json({ message: "Blog liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unlikeBlog = async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    const deleted = await Like.findOneAndDelete({ blogId, userId });

    if (!deleted) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.json({ message: "Blog unliked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
