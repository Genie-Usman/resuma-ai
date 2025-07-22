require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const geminiRoutes = require("./routes/geminiRoutes.js");

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://resuma-ai.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/gemini", geminiRoutes);

// Serve Uploads Folder
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "https://resuma-ai.vercel.app")
            res.set("Cross-Origin-Resource-Policy", "cross-origin");
        },
    })
);

app.get("/", (req, res) => {
  res.send("Resuma API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));