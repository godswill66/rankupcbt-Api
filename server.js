const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// 1. DATABASE CONNECTION
connectDB(process.env.MONGO_URI);

// 2. SECURITY & MIDDLEWARE
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "https://rankupcbt.vercel.app",
  }),
);

app.use(express.json());

// 3. LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 4. IMPORT ROUTES
const profileRoutes = require("./routes/profileRoutes");
const adminQuestions = require("./routes/adminQuestions");
const adminUpload = require("./routes/adminUpload");
const adminStats = require("./routes/adminStats");
const examRoutes = require("./routes/exam");
const resultRoutes = require("./routes/resultRoutes");
const userRoutes = require("./routes/userRoutes");

// 5. OFFICIAL API ROUTES
app.get("/", (req, res) => {
  res.status(200).json({
    message: "RankUp CBT Official API",
    status: "online",
    version: "1.0.0",
  });
});

// Auth & User Management
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes); // Handled by userRoutes.js
app.use("/api/profile", profileRoutes);

// CBT & Student Routes
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));
app.use("/api/exam", examRoutes);
app.use("/api/results", resultRoutes);

// Admin Management
app.use("/api/admin", adminQuestions);
app.use("/api/admin", adminUpload);
app.use("/api/admin", adminStats);

// 6. CATCH-ALL 404 (MUST BE THE VERY LAST ONE)
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.status(404).sendFile(path.join(__dirname, "404", "404.html"));
});

// 7. SERVER INITIALIZATION
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RankUp Server deployed successfully on port ${PORT}`);
});
