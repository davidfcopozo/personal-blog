import mongoose, { Schema, model } from "mongoose";
import { ImageInterface } from "../typings/models/image";

const imageSchema: Schema = new Schema<ImageInterface>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    alt: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hash: { type: String, unique: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Image = model("Image", imageSchema);

export default Image;
