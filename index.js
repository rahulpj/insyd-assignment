import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ msg: "health ok" });
});
app.use(express.json());

app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(); // wait until DB is connected
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect DB. Server not started.", err);
    process.exit(1);
  }
};

startServer();
