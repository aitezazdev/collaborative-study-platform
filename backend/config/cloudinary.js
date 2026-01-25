import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log("Cloudinary Config Check:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET");
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;