import mongoose from "mongoose";
const { Schema, model } = mongoose;

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Topic name is required"],
      unique: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Topic = model("Topic", topicSchema);

export default Topic;
