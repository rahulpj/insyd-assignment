import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";

const router = express.Router();

// Follow a user
router.post("/follow", followUser);

// Unfollow a user
router.post("/unfollow", unfollowUser);

// Get all followers of a user
router.get("/followers/:userId", getFollowers);

// Get all users that a user is following
router.get("/following/:userId", getFollowing);

export default router;
