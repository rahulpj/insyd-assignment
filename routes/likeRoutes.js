// routes/likeRoutes.js
import express from "express";
import { likeBlog, unlikeBlog } from "../controllers/likeController.js";

const router = express.Router();

router.post("/like", likeBlog);
router.post("/unlike", unlikeBlog);

export default router;
