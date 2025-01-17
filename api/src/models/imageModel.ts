import mongoose, { Schema, model } from "mongoose";
import { ImageInterface } from "../typings/models/image";

const imageSchema: Schema = new Schema<ImageInterface>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    altText: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hash: { type: String, required: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

imageSchema.index(
  { hash: 1, postedBy: 1 },
  {
    unique: true,
    name: "hash_postedBy_unique",
  }
);

const Image = model("Image", imageSchema);

export default Image;
