import Follow from "../models/Follow.model.js";
import Notification from "../models/Notification.model.js";

export const followUser = async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;

    if (followerId === followeeId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existing = await Follow.findOne({ followerId, followeeId });
    if (existing)
      return res.status(400).json({ message: "Already following this user" });

    const follow = await Follow.create({ followerId, followeeId });

    // Send notification to the followee
    await Notification.create({
      userId: followeeId,
      message: `You have a new follower!`,
    });

    res.status(201).json({ message: "Followed successfully", follow });
  } catch (err) {
    res.status(500).json({ error: "Follow failed", details: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;

    const result = await Follow.findOneAndDelete({ followerId, followeeId });

    if (!result)
      return res.status(404).json({ message: "Follow relationship not found" });

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Unfollow failed", details: err.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ followeeId: userId }).populate(
      "followerId",
      "name"
    );
    res.json(followers);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch followers", details: err.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ followerId: userId }).populate(
      "followeeId",
      "name"
    );
    res.json(following);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch following", details: err.message });
  }
};
