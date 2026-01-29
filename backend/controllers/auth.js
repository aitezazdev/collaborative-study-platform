import { User } from "../models/user.js";

export const firebaseLogin = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    const token = req.body.token;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email.split("@")[0],
        avatar: picture || "",
      });
    } else {
      console.log("Existing user found:", uid);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,                    
        id: user._id,                     
        uid: user.firebaseUid,
        firebaseUid: user.firebaseUid,   
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,                    
        id: user._id,                     
        uid: user.firebaseUid,
        firebaseUid: user.firebaseUid,   
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};