import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
  const user = await User.findOne();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("Authenticated as:", user.name);

  const PORT = 9226;
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1600,1000",
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

    if (!versionData) {
      console.error("Failed to connect to Chrome");
      chromeProcess.kill();
      return;
    }

    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://localhost:5173/`, { method: "PUT" });
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

    // Set HttpOnly/client cookie
    await send("Network.setCookie", {
      name: "token",
      value: token,
      domain: "localhost",
      path: "/",
    });

    // Wait for initial load
    await new Promise((r) => setTimeout(r, 1500));

    // Inject token into localStorage as well for compatibility
    await send("Runtime.evaluate", {
      expression: `localStorage.setItem('token', '${token}');`,
    });

    // Navigate to the resume editor
    console.log("Navigating to Resume Studio...");
    await send("Page.navigate", { url: "http://localhost:5173/resume/6aa2168dcd8942b6d43fd72e" });
    await new Promise((r) => setTimeout(r, 3500));

    // Helper to capture screenshot
    const saveScreenshot = async (filename) => {
      const screenshotRes = await send("Page.captureScreenshot", { format: "png" });
      if (screenshotRes?.result?.data) {
        const brainDest = path.join(
          "C:\\Users\\Mani\\.gemini\\antigravity-ide\\brain\\07f0804c-f940-455e-8a58-300d0420605d",
          filename
        );
        fs.writeFileSync(brainDest, Buffer.from(screenshotRes.result.data, "base64"));
        console.log(`📸 Saved screenshot to: ${brainDest}`);
      }
    };

    // Step 1: Check 2-Column Template (Azurill)
    console.log("--- Testing 2-Column Template Layout ---");
    const check2Col = await send("Runtime.evaluate", {
      expression: `(() => {
        const text = document.body.innerText;
        const hasMain = text.includes("MAIN CONTENT");
        const hasSidebar = text.includes("SIDEBAR");
        const has2ColBadge = text.includes("2-Column Layout");
        const has1ColBadge = text.includes("1-Column Layout");
        return { hasMain, hasSidebar, has2ColBadge, has1ColBadge };
      })()`,
      returnByValue: true,
    });
    console.log("2-Column Check:", check2Col.result.value);
    await saveScreenshot("two_column_drag_drop_verified.png");

    // Step 2: Open Theme Selector modal and select 1-column template (Kakuna or Bronzor)
    console.log("--- Switching to 1-Column Template (Kakuna) ---");
    await send("Runtime.evaluate", {
      expression: `(() => {
        // Find theme selector button in header
        const buttons = Array.from(document.querySelectorAll("button"));
        const themeBtn = buttons.find(b => b.innerText.includes("Theme") || b.title?.includes("Theme"));
        if (themeBtn) themeBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Kakuna or Bronzor template
    await send("Runtime.evaluate", {
      expression: `(() => {
        const allCards = Array.from(document.querySelectorAll("div, button"));
        // Look for kakuna or bronzor thumbnail card
        const kakunaCard = allCards.find(el => el.innerText && el.innerText.toLowerCase().includes("kakuna"));
        if (kakunaCard) {
          kakunaCard.click();
        } else {
          // Alternative: click 7th template card
          const cards = document.querySelectorAll(".template-card, img[alt*='kakuna'], img[alt*='bronzor']");
          if (cards.length > 0) cards[0].click();
        }
      })()`,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click Apply Theme button
    await send("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const applyBtn = buttons.find(b => b.innerText.includes("Apply Theme") || b.innerText.includes("Apply"));
        if (applyBtn) applyBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Step 3: Check 1-Column Template (Kakuna) in Editor Sidebar
    console.log("--- Testing 1-Column Template Layout ---");
    const check1Col = await send("Runtime.evaluate", {
      expression: `(() => {
        const aside = document.querySelector("aside");
        const asideText = aside ? aside.innerText : "";
        const hasMain = asideText.includes("MAIN CONTENT");
        const hasSidebar = asideText.includes("SIDEBAR");
        const hasResumeSections = asideText.includes("RESUME SECTIONS");
        const has1ColBadge = asideText.includes("1-Column Layout");
        const has2ColBadge = asideText.includes("2-Column Layout");
        const arrowButtons = document.querySelectorAll("button[title*='Move to']");
        return {
          hasMain,
          hasSidebar,
          hasResumeSections,
          has1ColBadge,
          has2ColBadge,
          arrowButtonCount: arrowButtons.length
        };
      })()`,
      returnByValue: true,
    });
    console.log("1-Column Check Result:", check1Col.result.value);
    await saveScreenshot("single_column_drag_drop_verified.png");

    // Step 4: Switch back to 2-column template (Azurill)
    console.log("--- Switching Back to 2-Column Template (Azurill) ---");
    await send("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const themeBtn = buttons.find(b => b.innerText.includes("Theme") || b.title?.includes("Theme"));
        if (themeBtn) themeBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1000));

    await send("Runtime.evaluate", {
      expression: `(() => {
        const allCards = Array.from(document.querySelectorAll("div, button"));
        const azurillCard = allCards.find(el => el.innerText && el.innerText.toLowerCase().includes("azurill"));
        if (azurillCard) azurillCard.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 800));

    await send("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const applyBtn = buttons.find(b => b.innerText.includes("Apply Theme") || b.innerText.includes("Apply"));
        if (applyBtn) applyBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1500));

    const checkSwitchedBack = await send("Runtime.evaluate", {
      expression: `(() => {
        const aside = document.querySelector("aside");
        const asideText = aside ? aside.innerText : "";
        const hasMain = asideText.includes("MAIN CONTENT");
        const hasSidebar = asideText.includes("SIDEBAR");
        const has2ColBadge = asideText.includes("2-Column Layout");
        return { hasMain, hasSidebar, has2ColBadge };
      })()`,
      returnByValue: true,
    });
    console.log("Switched Back 2-Column Check:", checkSwitchedBack.result.value);
    await saveScreenshot("switched_back_two_column_verified.png");

    await send("Page.close");
    ws.close();
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    chromeProcess.kill();
    await mongoose.disconnect();
  }
}

run();
