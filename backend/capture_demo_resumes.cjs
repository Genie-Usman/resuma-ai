const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const ARTIFACTS_DIR = "C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
  const user = await User.findOne({ email: "musman7533@gmail.com" }) || await User.findOne();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("Generated token for:", user.name, user.email);

  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9227",
    "--window-size=1600,1100",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  try {
    let versionData;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9227/json/version");
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {}
      await new Promise(r => setTimeout(r, 200));
    }

    if (!versionData) {
      console.error("Failed to connect to Chrome");
      chromeProcess.kill();
      return;
    }

    const newTabRes = await fetch("http://127.0.0.1:9227/json/new?http://localhost:5175/", { method: "PUT" });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send("Page.enable");
    await send("Runtime.enable");

    // Listen to browser console
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        console.log("[Browser Console]", ...msg.params.args.map(a => a.value));
      }
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    };

    // Navigate to dashboard with token
    console.log("Navigating to http://localhost:5175/dashboard?token=...");
    await send("Page.navigate", {
      url: `http://localhost:5175/dashboard?token=${token}`
    });

    // Wait for Dashboard to fetch and render resumes
    console.log("Waiting for dashboard to render 12 resumes...");
    await new Promise(r => setTimeout(r, 7000));

    // Capture 1: Dashboard with all 12 demo resumes
    const dashboardRes = await send("Page.captureScreenshot", { format: "png" });
    if (dashboardRes?.result?.data) {
      const destPath = path.join(ARTIFACTS_DIR, "demo_resumes_dashboard.png");
      fs.writeFileSync(destPath, Buffer.from(dashboardRes.result.data, "base64"));
      console.log("Saved demo_resumes_dashboard.png");
    }

    // Open "Create New Resume" modal
    console.log("Opening Create New Resume modal...");
    await send("Runtime.evaluate", {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Create Resume'));
        if (btn) btn.click();
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture 2: Template Picker showing 12 templates with 1-Col / 2-Col badges
    const templatePickerRes = await send("Page.captureScreenshot", { format: "png" });
    if (templatePickerRes?.result?.data) {
      const destPath = path.join(ARTIFACTS_DIR, "demo_resumes_template_picker.png");
      fs.writeFileSync(destPath, Buffer.from(templatePickerRes.result.data, "base64"));
      console.log("Saved demo_resumes_template_picker.png");
    }

    // Find the first resume ID in the database
    const Resume = mongoose.model("Resume", new mongoose.Schema({}, { strict: false }));
    const firstResume = await Resume.findOne({ userId: user._id, slug: "muhammad-usman-azurill-ai-architect" });
    if (firstResume) {
      console.log("Navigating to first resume:", firstResume._id);
      await send("Runtime.evaluate", {
        expression: `window.location.href = '/resume/${firstResume._id}';`
      });

      // Wait for Resume Studio to load
      await new Promise(r => setTimeout(r, 5000));

      // Capture 3: Resume Studio / Live Preview with Discreet QR code
      const resumeStudioRes = await send("Page.captureScreenshot", { format: "png" });
      if (resumeStudioRes?.result?.data) {
        const destPath = path.join(ARTIFACTS_DIR, "demo_resume_azurill_preview.png");
        fs.writeFileSync(destPath, Buffer.from(resumeStudioRes.result.data, "base64"));
        console.log("Saved demo_resume_azurill_preview.png");
      }
    }

    await send("Page.close");
    ws.close();
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    chromeProcess.kill();
    await mongoose.disconnect();
  }
}

run();
