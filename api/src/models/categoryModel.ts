import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
    },
    topic: {
      type: ObjectId,
      ref: "Topic",
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
