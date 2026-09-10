import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Resume = mongoose.model("Resume", new mongoose.Schema({}, { strict: false }));
  
  // Find resumes that have blank / empty thumbnail links or the specific stale blank Cloudinary png
  const staleIds = ["ctsus6l95shgv5nmvoso"];
  const updateRes = await Resume.updateMany(
    {
      $or: [
        { thumbnailLink: { $regex: "ctsus6l95shgv5nmvoso" } },
        { title: /Executive Leadership/i }
      ]
    },
    { $set: { thumbnailLink: "" } }
  );

  console.log("Updated stale blank thumbnails:", updateRes);
  await mongoose.disconnect();
}

run().catch(console.error);
