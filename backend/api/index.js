let app;
let initError = null;

try {
  app = require("../server");
} catch (err) {
  initError = err;
  console.error("Vercel Serverless Initialization Error:", err);
}

module.exports = (req, res) => {
  if (initError) {
    console.error("Handler invoked but server initialization failed:", initError);
    return res.status(500).json({
      error: "Serverless Function Initialization Failed",
      message: initError.message,
      stack: initError.stack,
    });
  }

  // Restore client-facing URL if Vercel internal router rewrote req.url to function destination
  if (req.headers["x-matched-path"] && req.headers["x-matched-path"] !== req.url) {
    const queryIndex = req.url.indexOf("?");
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = req.headers["x-matched-path"] + query;
  }

  return app(req, res);
};
