import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true, 
    },
    name: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
