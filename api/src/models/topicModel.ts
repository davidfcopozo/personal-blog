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
    description: String, // Optional field to store additional information about the topic
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
