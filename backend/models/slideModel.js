import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalFileName: { type: String },
    fileType: { type: String },
    convertedToPdf: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Slide = mongoose.model("Slide", slideSchema);
