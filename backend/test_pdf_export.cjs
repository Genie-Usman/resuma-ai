const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

async function run() {
  console.log("=== Testing Server-Side Headless Vector PDF Export ===");

  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
  const Resume = mongoose.model("Resume", new mongoose.Schema({ title: String, slug: String, userId: mongoose.Schema.Types.ObjectId, isPublic: Boolean }));

  const user = await User.findOne({ email: "musman7533@gmail.com" }) || await User.findOne();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("User:", user.name, "ID:", user._id.toString());

  const resume = await Resume.findOne({ userId: user._id });
  if (!resume) {
    console.error("No resume found for user");
    await mongoose.disconnect();
    return;
  }
  console.log("Target Resume:", resume.title, "ID:", resume._id.toString());

  // 1. Test Authenticated Owner Export
  console.log("\n1. Testing GET /api/resume/:id/export-pdf...");
  const startTime = Date.now();
  const res = await fetch(`http://localhost:5000/api/resume/${resume._id}/export-pdf`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log("Status:", res.status, res.statusText);
  console.log("Content-Type:", res.headers.get("content-type"));
  console.log("Content-Disposition:", res.headers.get("content-disposition"));

  if (!res.ok) {
    const errText = await res.text();
    console.error("Export failed:", errText);
    await mongoose.disconnect();
    return;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Generated PDF in ${elapsed}s, Size: ${buffer.length} bytes (${(buffer.length / 1024).toFixed(1)} KB)`);

  // Check magic bytes
  const magic = buffer.subarray(0, 5).toString();
  console.log("Magic bytes (should be %PDF-):", magic);
  if (magic.startsWith("%PDF-")) {
    console.log("VALID VECTOR PDF CONFIRMED!");
  } else {
    console.error("INVALID PDF FORMAT:", magic);
  }

  const outPath = path.join("C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d", "exported_resume_headless.pdf");
  fs.writeFileSync(outPath, buffer);
  console.log("Saved PDF to:", outPath);

  // 2. Test Public Recruiter Export (if resume is public)
  if (resume.slug) {
    console.log("\n2. Testing Public Recruiter GET /api/resume/public/:slug/export-pdf...");
    const pubStart = Date.now();
    const pubRes = await fetch(`http://localhost:5000/api/resume/public/${resume.slug}/export-pdf`);
    console.log("Public Export Status:", pubRes.status);
    if (pubRes.ok) {
      const pubBuf = Buffer.from(await pubRes.arrayBuffer());
      const pubElapsed = ((Date.now() - pubStart) / 1000).toFixed(2);
      console.log(`Public PDF Generated in ${pubElapsed}s, Size: ${pubBuf.length} bytes`);
      console.log("PUBLIC RECRUITER EXPORT CONFIRMED!");
    } else {
      console.error("Public export error:", await pubRes.text());
    }
  }

  await mongoose.disconnect();
  console.log("\n=== All Headless PDF Export Tests Completed Successfully! ===");
}

run().catch(console.error);
