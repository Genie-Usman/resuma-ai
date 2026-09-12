import { spawn } from "child_process";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function checkConsole() {
  await mongoose.connect(process.env.MONGO_URI);
  const Resume = mongoose.model("Resume", new mongoose.Schema({}, { strict: false }));
  const resume = await Resume.findById("6aa2168dcd8942b6d43fd72e");
  const token = jwt.sign({ id: resume.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  const PORT = 9235;
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1600,1050",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  try {
    let versionData;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }

    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://localhost:5173/`, { method: "PUT" });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleLogs.push({ type: msg.params.type, args: msg.params.args.map(a => a.value || a.description) });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        consoleLogs.push({ type: "EXCEPTION", exception: msg.params.exceptionDetails });
      }
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result);
        pending.delete(msg.id);
      }
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");

    await send("Page.addScriptToEvaluateOnNewDocument", {
      source: `localStorage.setItem('token', '${token}');`,
    });

    await send("Page.navigate", { url: "http://localhost:5173/resume/6aa2168dcd8942b6d43fd72e" });
    await new Promise((r) => setTimeout(r, 3000));

    await send("Runtime.evaluate", {
      expression: `(() => {
        const items = Array.from(document.querySelectorAll('div.cursor-pointer'));
        const profItem = items.find(el => el.textContent.includes('Online Profiles'));
        if (profItem) {
          profItem.click();
        }
      })()`
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Type 'tiktok' into the first Icon Slug input
    await send("Runtime.evaluate", {
      expression: `(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const iconInput = inputs.find(i => i.placeholder && i.placeholder.includes('globe, linkedin'));
        if (iconInput) {
          // Simulate typing 't', 'ti', 'tik', 'tiktok'
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeInputValueSetter.call(iconInput, 'tiktok');
          iconInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`
    });
    await new Promise((r) => setTimeout(r, 1500));

    const screenshotData = await send("Page.captureScreenshot");
    if (screenshotData && screenshotData.data) {
      const fs = (await import("fs")).default;
      fs.writeFileSync("tiktok_verified.png", Buffer.from(screenshotData.data, "base64"));
      console.log("Screenshot saved to tiktok_verified.png");
    }

    console.log("=== CONSOLE LOGS & EXCEPTIONS ===");
    console.log(JSON.stringify(consoleLogs, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    chromeProcess.kill();
    await mongoose.disconnect();
  }
}

checkConsole();
