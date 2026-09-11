import { spawn } from "child_process";

async function run() {
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--window-size=1200,1400",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  // Wait for port 9222 to be ready
  let versionData;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("Chrome connected:", versionData.Browser);

  // Open a new tab
  const newTabRes = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      console.log("Browser console:", ...msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === "Runtime.exceptionThrown") {
      console.error("Browser error:", msg.params.exceptionDetails);
    }
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");

  // Navigate to test_capture.html
  const fileUrl = "file:///d:/Projects/resuma-ai/scratch/test_capture.html";
  await send("Page.navigate", { url: fileUrl });

  // Wait for html2canvas to finish
  await new Promise(r => setTimeout(r, 4500));



  // Capture screenshot of the output canvas
  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  const fs = await import("fs");
  fs.writeFileSync("d:/Projects/resuma-ai/scratch/cdp_screenshot.png", Buffer.from(screenshot.result.data, "base64"));
  console.log("Screenshot saved to d:/Projects/resuma-ai/scratch/cdp_screenshot.png");

  ws.close();
  chromeProcess.kill();
}

run().catch(console.error);
