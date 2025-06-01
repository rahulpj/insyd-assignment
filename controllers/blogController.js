import Blog from "../models/Blog.model.js";
import Follow from "../models/Follow.model.js";
import Notification from "../models/Notification.model.js";
import Activity from "../models/Activity.model.js";

export const createBlog = async (req, res) => {
  try {
    const { authorId, title, content, tags } = req.body;

    const blog = new Blog({ authorId, title, content, tags });
    const savedBlog = await blog.save();

    // Log the activity
    const activity = await new Activity({
      userId: authorId,
      type: "BLOG_POST",
      targetId: savedBlog._id,
      metadata: { title },
    }).save();

    // Notify followers
    const followers = await Follow.find({ followeeId: authorId });

    const notifications = followers.map((f) => ({
      userId: f.followerId,
      message: `A user you follow published a new blog: "${title}"`,
      activityId: activity._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(savedBlog);
  } catch (err) {
    console.error("Blog creation failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username fullName");
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogsFromFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Find all followees of this user
    const followRecords = await Follow.find({ followerId: userId });

    const followeeIds = followRecords.map((record) => record.followeeId);

    if (followeeIds.length === 0) {
      return res.json([]); // No followees, return empty blog list
    }

    // Step 2: Find blogs where authorId is in followeeIds
    const blogs = await Blog.find({ authorId: { $in: followeeIds } }).populate(
      "authorId",
      "username fullName"
    );

    res.json(blogs);
  } catch (err) {
    console.error("Error fetching followed blogs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const blogs = await Blog.find({ authorId: userId }).populate(
      "authorId",
      "username fullName"
    );

    res.json(blogs);
  } catch (err) {
    console.error("Error fetching user's blogs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "authorId",
      "username fullName"
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
