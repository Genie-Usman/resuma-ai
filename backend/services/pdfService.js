const fs = require("fs");
const path = require("path");

/**
 * Automatically detects Google Chrome or Chromium executable on Windows, Linux, and macOS.
 */
function getChromeExecutablePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const standardPaths = [
    // Windows Google Chrome
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
    // Windows Microsoft Edge (fallback)
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    // Linux / Containers
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];

  for (const candidate of standardPaths) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "No Chromium or Google Chrome binary found on server. Please install Google Chrome or set CHROME_PATH."
  );
}

/**
 * Launches a headless Chrome instance with optimized container/production flags.
 * Seamlessly supports Vercel Serverless Functions via @sparticuz/chromium
 * and local development via automatic system Chrome detection.
 */
async function launchHeadlessBrowser() {
  // Dynamically import ESM-only puppeteer-core (prevents ERR_REQUIRE_ESM on Node 20 cold-starts)
  const puppeteerModule = await import("puppeteer-core");
  const puppeteer = puppeteerModule.default || puppeteerModule;

  const isVercel = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_VERSION ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isVercel) {
    const chromiumModule = await import("@sparticuz/chromium-min");
    const chromium = chromiumModule.default || chromiumModule;

    const arch = process.arch === "arm64" ? "arm64" : "x64";
    const defaultPackUrl = `https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.${arch}.tar`;
    const packUrl = process.env.CHROMIUM_PACK_URL || defaultPackUrl;

    const args = [
      ...chromium.args,
      "--disable-web-security",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
    ];

    const executablePath = await chromium.executablePath(packUrl);

    return await puppeteer.launch({
      args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  }

  // Local Development (Windows, macOS, Linux)
  const executablePath = getChromeExecutablePath();
  return await puppeteer.launch({
    executablePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-sync",
      "--disable-translate",
      "--metrics-recording-only",
      "--mute-audio",
      "--safebrowsing-disable-auto-update",
    ],
  });
}

/**
 * Generates a pixel-perfect, 100% vector PDF using Headless Chromium.
 * Navigates to the dedicated print view, waits for fonts & assets, and renders vector PDF.
 */
async function generateVectorPdf({ resumeId, token, slug, isPublic = false, frontendUrl = "", format = "A4", mode = "resume" }) {
  const browser = await launchHeadlessBrowser();
  let page = null;

  try {
    page = await browser.newPage();

    // High DPI viewport for crisp rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    const baseUrl = (frontendUrl || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    let targetUrl;

    if (isPublic && slug) {
      targetUrl = `${baseUrl}/print/public/${slug}?mode=${encodeURIComponent(mode || "resume")}${token ? `&unlockToken=${encodeURIComponent(token)}` : ""}`;
    } else {
      targetUrl = `${baseUrl}/print/${resumeId}?token=${encodeURIComponent(token || "")}&mode=${encodeURIComponent(mode || "resume")}`;
    }

    // Emulate print media so CSS print overrides and @page rules activate
    await page.emulateMediaType("print");

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    // Wait for the explicit React DOM ready signal
    await page.waitForSelector("#print-ready", { timeout: 15000 });

    // Wait for web fonts to finish rendering
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });

    // Produce standard Vector PDF (A4 or Letter)
    const puppeteerFormat = (format && format.toLowerCase() === "letter") ? "Letter" : "A4";
    const pdfBuffer = await page.pdf({
      format: puppeteerFormat,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

module.exports = {
  getChromeExecutablePath,
  generateVectorPdf,
};
