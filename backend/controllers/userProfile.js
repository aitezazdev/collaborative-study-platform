import { User } from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// get user profile info
export const getUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
        
    if (!firebaseUid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const user = await User.findOne({ firebaseUid }).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const responseData = {
      _id: user._id,
      id: user._id,
      uid: user.firebaseUid,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    };
        
    res.status(200).json({ 
      success: true, 
      message: "User profile", 
      data: responseData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// update user profile info
export const updateProfile = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    
    if (!firebaseUid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      try {
        const result = await uploadAvatar();
        if (user.avatarPublicId) {
          await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        updatedData.avatar = result.secure_url;
        updatedData.avatarPublicId = result.public_id;
      } catch (uploadError) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to upload avatar", 
          error: uploadError.message 
        });
      }
    } else {
      console.log("⚠️ No file buffer found in request");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updatedData },
      { new: true },
    ).select("-password");

    const responseData = {
      _id: updatedUser._id,
      id: updatedUser._id,
      uid: updatedUser.firebaseUid,
      firebaseUid: updatedUser.firebaseUid,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    };


    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: responseData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};