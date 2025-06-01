// controllers/notificationController.js
import Notification from "../models/Notification.model.js";
import mongoose from "mongoose";

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // Or get from auth/session later

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit to latest 50 (optional)

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsSeen = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as seen", notification: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllNotificationsAsSeen = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await Notification.updateMany(
      { userId, seen: false },
      { seen: true }
    );

    res.json({
      message: `${result.modifiedCount} notifications marked as seen`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
