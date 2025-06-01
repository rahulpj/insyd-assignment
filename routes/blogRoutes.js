import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogsFromFollowing,
  getBlogById,
  getBlogsByUser,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/following/:userId", getBlogsFromFollowing);
router.get("/user/:userId", getBlogsByUser);

export default router;
