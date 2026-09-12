require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const geminiRoutes = require("./routes/geminiRoutes.js");

const app = express();

// Trust reverse proxy for accurate IP identification behind Vercel edge routers
app.set("trust proxy", 1);

// Allowed origins for CORS (supports localhost, FRONTEND_URL, and *.vercel.app)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://resuma-ai.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, headless chromium)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".vercel.sh")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Standard JSON body parser
app.use(express.json());

// Public Health Check (responds fast without waiting for DB)
app.get("/", (req, res) => {
  res.send("Resuma API is running...");
});

// Lightweight Keep-Alive Ping (instant response for uptime monitors)
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// Full Keep-Alive Ping (keeps server and MongoDB connection pool warm)
app.get("/api/ping", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      status: "ok",
      message: "pong (server and database warm)",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    });
  } catch (err) {
    res.status(200).json({
      status: "degraded",
      message: "pong (database reconnecting)",
      error: err.message,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    });
  }
});

// Serverless DB Connection Middleware for all API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failure:", err.message);
    res.status(503).json({ error: "Database unavailable. Please check MONGO_URI." });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/gemini", geminiRoutes);

// Serve Uploads Folder (for local development fallback)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Start Server (standalone server for local development or container hosting)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    const { startKeepAlive } = require("./utils/keepAlive");
    startKeepAlive();
  });
}

module.exports = app;