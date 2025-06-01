import express from "express";
import {
  createComment,
  getCommentsForBlog,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:blogId", getCommentsForBlog);

export default router;
