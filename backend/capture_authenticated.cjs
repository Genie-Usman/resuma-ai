const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
  const user = await User.findOne({ email: "musman7533@gmail.com" }) || await User.findOne();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("Generated token for:", user.name);

  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9226",
    "--window-size=1600,1000",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  try {
    let versionData;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9226/json/version");
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

    const newTabRes = await fetch("http://127.0.0.1:9226/json/new?http://localhost:5173/", { method: "PUT" });
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

    // Wait for Landing Page to load
    await new Promise(r => setTimeout(r, 2500));

    // 1. Screenshot Landing Page (shows normalized max-w-7xl header and gradient background)
    const landingRes = await send("Page.captureScreenshot", { format: "png" });
    if (landingRes?.result?.data) {
      const destPath = path.join("C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d", "landing_normalized.png");
      fs.writeFileSync(destPath, Buffer.from(landingRes.result.data, "base64"));
      console.log("Saved landing_normalized.png");
    }

    // Set token in localStorage and navigate to dashboard
    await send("Runtime.evaluate", {
      expression: `localStorage.setItem('token', '${token}'); window.location.href = '/dashboard';`
    });

    // Wait for Dashboard to load and render resumes
    await new Promise(r => setTimeout(r, 3500));

    // 2. Screenshot Dashboard (shows matching max-w-7xl header, user profile, and resumes grid)
    const dashboardRes = await send("Page.captureScreenshot", { format: "png" });
    if (dashboardRes?.result?.data) {
      const destPath = path.join("C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d", "dashboard_normalized.png");
      fs.writeFileSync(destPath, Buffer.from(dashboardRes.result.data, "base64"));
      console.log("Saved dashboard_normalized.png");
    }

    // Navigate to Resume Editor for 6aa3333cfd6e3a393e20e3e0 (Azurill "Muhammad Usman Resume (Copy)")
    console.log("Navigating to Azurill resume 6aa3333cfd6e3a393e20e3e0...");
    await send("Runtime.evaluate", {
      expression: `window.location.href = '/resume/6aa3333cfd6e3a393e20e3e0';`
    });

    // Wait for Studio to load
    await new Promise(r => setTimeout(r, 4000));

    // Click Save button in Studio to regenerate thumbnail with new w-full centering fix
    console.log("Triggering save in Studio for Azurill resume to regenerate thumbnail...");
    await send("Runtime.evaluate", {
      expression: `
        const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Save resume progress'));
        if (saveBtn) saveBtn.click();
      `
    });

    // Wait 6 seconds for thumbnail generation and backend upload
    await new Promise(r => setTimeout(r, 6000));

    // Navigate back to Dashboard to inspect updated thumbnail
    await send("Runtime.evaluate", {
      expression: `window.location.href = '/dashboard';`
    });

    await new Promise(r => setTimeout(r, 4000));

    const updatedDashboardRes = await send("Page.captureScreenshot", { format: "png" });
    if (updatedDashboardRes?.result?.data) {
      const destPath = path.join("C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d", "dashboard_thumbnail_verified.png");
      fs.writeFileSync(destPath, Buffer.from(updatedDashboardRes.result.data, "base64"));
      console.log("Saved dashboard_thumbnail_verified.png");
    }

    await send("Page.close");
    ws.close();
  } finally {
    chromeProcess.kill();
    await mongoose.disconnect();
  }
}

run();
