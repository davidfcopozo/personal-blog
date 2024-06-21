import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { UserInterface } from "../typings/models/user";

const userSchema = new mongoose.Schema<UserInterface>(
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
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
