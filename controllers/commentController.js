import Comment from "../models/Comment.model.js";
import Blog from "../models/Blog.model.js";
import Notification from "../models/Notification.model.js";
import Activity from "../models/Activity.model.js";

export const createComment = async (req, res) => {
  try {
    console.log(req.body);
    const { blogId, commenterId, text } = req.body;

    const comment = new Comment({ blogId, commenterId, text });
    const savedComment = await comment.save();

    // Fetch blog and author
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Log the activity
    const activity = await new Activity({
      userId: commenterId,
      type: "COMMENT",
      targetId: savedComment._id,
      metadata: { blogTitle: blog.title },
    }).save();

    // Notify blog author
    if (commenterId.toString() !== blog.authorId.toString()) {
      const notification = new Notification({
        userId: blog.authorId,
        message: `Your blog "${blog.title}" received a new comment.`,
        activityId: activity._id,
      });

      await notification.save();
    }

    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Comment creation failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCommentsForBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const comments = await Comment.find({ blogId })
      .populate("commenterId", "username fullName")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
