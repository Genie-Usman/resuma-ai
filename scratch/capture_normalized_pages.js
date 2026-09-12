import { spawn } from "child_process";
import fs from "fs";
import path from "path";

async function run() {
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9223",
    "--window-size=1600,1000",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  try {
    // Wait for port 9223
    let versionData;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9223/json/version");
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

    console.log("Chrome connected successfully:", versionData.Browser);

    const pages = [
      { name: "landing", url: "http://localhost:5173/" },
      { name: "dashboard", url: "http://localhost:5173/dashboard" },
      { name: "edit_resume", url: "http://localhost:5173/resume/6aa2168dcd8942b6d43fd72e" }
    ];

    for (const p of pages) {
      console.log(`Navigating to ${p.url}...`);
      const newTabRes = await fetch("http://127.0.0.1:9223/json/new?about:blank", { method: "PUT" });
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
      await send("Page.navigate", { url: p.url });

      // Wait 3 seconds for rendering
      await new Promise(r => setTimeout(r, 3000));

      const screenshotRes = await send("Page.captureScreenshot", { format: "png" });
      if (screenshotRes?.result?.data) {
        const filePath = path.join("scratch", `${p.name}_normalized.png`);
        fs.writeFileSync(filePath, Buffer.from(screenshotRes.result.data, "base64"));
        console.log(`Saved screenshot: ${filePath}`);
      }

      await send("Page.close");
      ws.close();
    }
  } finally {
    chromeProcess.kill();
  }
}

run();
