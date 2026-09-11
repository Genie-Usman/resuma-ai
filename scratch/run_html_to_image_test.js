import { spawn } from "child_process";
import fs from "fs";

async function run() {
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--window-size=1200,1400",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

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

  const fileUrl = "file:///d:/Projects/resuma-ai/scratch/test_html_to_image_full.html";
  await send("Page.navigate", { url: fileUrl });

  // Wait 3 seconds for html-to-image to finish
  await new Promise(r => setTimeout(r, 3000));

  // Extract generated JPEG data URL from html-to-image
  const dataUrlResult = await send("Runtime.evaluate", {
    expression: "document.querySelector('#output-container img')?.src",
    returnByValue: true
  });
  const dataUrl = dataUrlResult.result?.result?.value;
  if (dataUrl && dataUrl.startsWith("data:")) {
    const base64 = dataUrl.split(",")[1];
    fs.writeFileSync("d:/Projects/resuma-ai/scratch/html_to_image_thumb.jpg", Buffer.from(base64, "base64"));
    console.log("SUCCESS! Saved raw html-to-image JPEG to d:/Projects/resuma-ai/scratch/html_to_image_thumb.jpg");
  } else {
    console.error("No data URL found in img element!");
  }

  ws.close();
  chromeProcess.kill();
}

run().catch(console.error);
