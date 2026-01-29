import mongoose from "mongoose";
import { Class } from "./models/classModel.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const randomString = crypto.randomBytes(3).toString("hex");
  return `${baseSlug}-${randomString}`;
};

const migrateClassSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const classes = await Class.find({ slug: { $exists: false } });
    console.log(`Found ${classes.length} classes without slugs`);

    for (const cls of classes) {
      const slug = generateSlug(cls.title);
      cls.slug = slug;
      await cls.save();
      console.log(`Added slug "${slug}" to class: ${cls.title}`);
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateClassSlugs();