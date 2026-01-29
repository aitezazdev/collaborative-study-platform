import { Class } from "../models/classModel.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { Slide } from "../models/slideModel.js";

const generateSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await Class.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

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

    const slug = await generateSlug(title);

    const newClass = await Class.create({
      title,
      slug,
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

export const fetchClassBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findOne({ slug })
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const isTeacher = foundClass.teacher._id.toString() === user._id.toString();
    const isStudent = foundClass.students.some(
      student => student._id.toString() === user._id.toString()
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this class",
      });
    }

    res.json({
      success: true,
      message: "Class fetched successfully",
      class: foundClass,
      isTeacher,
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
    const { slug } = req.params;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findOne({ slug });

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

    const slides = await Slide.find({ class: foundClass._id });

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

    await Slide.deleteMany({ class: foundClass._id });
    await Class.findByIdAndDelete(foundClass._id);

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
    const { slug } = req.params;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findOne({ slug }).populate(
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
    const { slug } = req.params;
    const { title, description } = req.body;
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundClass = await Class.findOne({ slug });

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

    if (title && title !== foundClass.title) {
      foundClass.title = title;
      foundClass.slug = await generateSlug(title);
    }
    if (description !== undefined) foundClass.description = description;

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

export const fixClassSlugs = async (req, res) => {
  try {
    const classes = await Class.find({});
    let updatedCount = 0;
    
    for (const cls of classes) {
      const slug = await generateSlug(cls.title);
      cls.slug = slug;
      await cls.save();
      updatedCount++;
    }

    res.json({
      success: true,
      message: `${updatedCount} classes updated with slugs`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};