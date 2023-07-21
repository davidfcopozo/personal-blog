import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, require: [true, "Reply can't be empty"] },
});

module.exports = mongoose.model("Reply", replySchema);
