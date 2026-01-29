import { Class } from "../models/classModel.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { Slide } from "../models/slideModel.js";

export const createClass = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let joinCode = crypto.randomBytes(4).toString("hex");
    const existingClass = await Class.findOne({ joinCode });
    if (existingClass) {
      joinCode = crypto.randomBytes(4).toString("hex");
    }

    const newClass = await Class.create({
      title,
      description: description || "",
      teacher: user._id,
      joinCode,
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: populatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const joinClass = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!joinCode) {
      return res.status(400).json({
        success: false,
        message: "Join code is required",
      });
    }

    const foundClass = await Class.findOne({ joinCode });

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (foundClass.teacher.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Teacher cannot join their own class",
      });
    }

    if (foundClass.students.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already joined",
      });
    }

    foundClass.students.push(user._id);
    await foundClass.save();

    const populatedClass = await Class.findById(foundClass._id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    res.json({
      success: true,
      message: "Joined class successfully",
      class: populatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const fetchUserClasses = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const classes = await Class.find({
      $or: [{ teacher: user._id }, { students: user._id }],
    })
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    return res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (foundClass.teacher.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the teacher can delete the class",
      });
    }

    const slides = await Slide.find({ class: classId });

    if (slides.length > 0) {
      for (const slide of slides) {
        try {
          await cloudinary.uploader.destroy(slide.public_id, {
            resource_type: "raw",
          });
        } catch (cloudinaryError) {
          console.error(
            `Failed to delete slide ${slide.public_id} from Cloudinary:`,
            cloudinaryError,
          );
        }
      }
    }

    await Slide.deleteMany({ class: classId });
    await Class.findByIdAndDelete(classId);

    res.json({
      success: true,
      message: "Class and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const fetchClassStudents = async (req, res) => {
  try {
    const classId = req.params.id;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findById(classId).populate(
      "students",
      "name email avatar",
    );

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      message: "Class students fetched successfully",
      students: foundClass.students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { title, description } = req.body;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (foundClass.teacher.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the teacher can update the class",
      });
    }

    if (title) foundClass.title = title;
    if (description) foundClass.description = description;

    await foundClass.save();

    const populatedClass = await Class.findById(foundClass._id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    res.json({
      success: true,
      message: "Class updated successfully",
      class: populatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};