import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    verificationToken: { type: String },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    passwordToken: { type: String },
    passwordExpirationDate: { type: Date },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password with passwordHash
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// return JWT token
userSchema.methods.getJWT = function () {
  const token = JWT.sign(
    { userId: this._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 3600,
    }
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
