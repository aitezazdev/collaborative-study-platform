import { User } from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// get user profile info
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User profile", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// update user profile info
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const updatedData = {};

    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.bio) updatedData.bio = req.body.bio;

    if (req.file?.buffer) {
      const uploadAvatar = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "user_avatars",
              allowed_formats: ["jpg", "jpeg", "png", "webp"],
              resource_type: "image",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadAvatar();

      const user = await User.findById(userId);
      if (user?.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      updatedData.avatar = result.secure_url;
      updatedData.avatarPublicId = result.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
