import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { UserInterface } from "../typings/models/user";
import Topic from "./topicModel";
import Category from "./categoryModel";
const { Schema } = mongoose;

const userSchema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true, minlength: 2, maxlength: 128 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 128 },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: { type: String, required: true, default: "user" },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      minlength: 3,
      maxlength: 256,
    },
    verificationToken: { type: String },
    website: { type: String },
    title: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    passwordVerificationToken: { type: String, default: "" },
    passwordTokenExpirationDate: { type: Date, default: null },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    topicsOfInterest: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
      validate: {
        validator: async function (topics: String[]) {
          const allowedTopics = await Topic.find({
            name: { $in: topics },
          }).select("name");
          const allowedTopicsList = allowedTopics.map((topic) => topic.name);

          return topics.every((topic) =>
            allowedTopicsList.includes(topic as string)
          );
        },
        message: "One or more selected topics are invalid.",
      },
    },
    technologies: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      validate: {
        validator: async function (techs: String[]) {
          const allowedTechnologies = await Category.find({
            name: { $in: techs },
          }).select("name");
          const allowedTechnologiesList = allowedTechnologies.map(
            (tech) => tech.name
          );

          return techs.every((tech) =>
            allowedTechnologiesList.includes(tech as string)
          );
        },
        message: "One or more selected technologies are invalid.",
      },
    },
    socialMediaProfiles: {
      x: String,
      linkedIn: String,
      github: String,
      facebook: String,
      instagram: String,
      dribble: String,
    },
    isOnboarded: { type: Boolean, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (this: UserInterface, next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(`${this.password}`, salt);
});

// Compare password with passwordHash
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// return JWT token
userSchema.methods.getJWT = function () {
  const token = JWT.sign(
    { userId: this._id },
    process.env.JWT_SECRET as string
  );

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
