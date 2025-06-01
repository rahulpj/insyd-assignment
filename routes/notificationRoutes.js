// routes/notificationRoutes.js
import express from "express";
import {
  getUserNotifications,
  markNotificationAsSeen,
  markAllNotificationsAsSeen,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getUserNotifications);
router.patch("/seen/:notificationId", markNotificationAsSeen);
router.patch("/seen", markAllNotificationsAsSeen);

export default router;
