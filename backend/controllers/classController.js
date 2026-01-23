import { Class } from "../models/classModel.js";
import crypto from "crypto";

export const createClass = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    let joinCode = crypto.randomBytes(4).toString("hex");
    const existingClass = await Class.findOne({ joinCode });
    if (existingClass) {
      joinCode = crypto.randomBytes(4).toString("hex");
    }

    const newClass = await Class.create({
      title,
      description,
      teacher: req.user._id,
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
    res.status(500).json({ message: "Server Error" });
  }
};

// join class
export const joinClass = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    const foundClass = await Class.findOne({ joinCode });

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (foundClass.teacher.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Teacher already in class" });
    }

    if (foundClass.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    foundClass.students.push(req.user._id);
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
    res.status(500).json({ message: "Server Error" });
  }
};
