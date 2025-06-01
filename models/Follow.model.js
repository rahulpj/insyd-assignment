import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followedAt: { type: Date, default: Date.now },
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
