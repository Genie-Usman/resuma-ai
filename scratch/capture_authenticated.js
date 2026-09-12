import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
  const user = await User.findOne();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("Generated token for:", user.name);

  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9224",
    "--window-size=1600,1000",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  try {
    let versionData;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9224/json/version");
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

    const newTabRes = await fetch("http://127.0.0.1:9224/json/new?http://localhost:5173/", { method: "PUT" });
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

    // Wait for initial load
    await new Promise(r => setTimeout(r, 1500));

    // Inject token into localStorage
    await send("Runtime.evaluate", {
      expression: `localStorage.setItem('token', '${token}'); location.reload();`
    });

    await new Promise(r => setTimeout(r, 2000));

    const pages = [
      { name: "landing", url: "http://localhost:5173/" },
      { name: "dashboard", url: "http://localhost:5173/dashboard" },
      { name: "edit_resume", url: "http://localhost:5173/resume/6aa2168dcd8942b6d43fd72e" }
    ];

    for (const p of pages) {
      console.log(`Navigating to ${p.url}...`);
      await send("Page.navigate", { url: p.url });
      await new Promise(r => setTimeout(r, 3000));

      const screenshotRes = await send("Page.captureScreenshot", { format: "png" });
      if (screenshotRes?.result?.data) {
        const filePath = path.join("scratch", `${p.name}_normalized.png`);
        fs.writeFileSync(filePath, Buffer.from(screenshotRes.result.data, "base64"));
        const destPath = path.join("C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d", `${p.name}_normalized.png`);
        fs.writeFileSync(destPath, Buffer.from(screenshotRes.result.data, "base64"));
        console.log(`Saved screenshot: ${filePath} & ${destPath}`);
      }
    }

    await send("Page.close");
    ws.close();
  } finally {
    chromeProcess.kill();
    await mongoose.disconnect();
  }
}

run();
