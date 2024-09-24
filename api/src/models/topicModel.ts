import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Topic name is required"],
      unique: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
