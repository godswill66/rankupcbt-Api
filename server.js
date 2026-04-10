const express = require("express");
const path = require("path"); 
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet"); // Added for Security
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// 1. DATABASE CONNECTION
connectDB(process.env.MONGO_URI);

// 2. SECURITY MIDDLEWARE (Must come before routes)
// Helmet adds headers that protect against common attacks and help clear Google warnings
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if you have issues with external scripts
}));

app.use(
  cors({
    credentials: true,
    // Ensure your Render Environment Variable 'FRONTEND_URL' has NO trailing slash
    // Example: https://rankupcbt.vercel.app
    origin: process.env.FRONTEND_URL || "https://rankupcbt.vercel.app", 
  })
);

app.use(express.json());

// 3. LOGGING MIDDLEWARE (To see requests in Render logs)
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
const userRoutes = require('./routes/userRoutes');

// 5. OFFICIAL API ROUTES
// Root Route - Proves to Google bots that this is a valid API
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "RankUp CBT Official API", 
    status: "online",
    version: "1.0.0"
  });
});

// Auth & User Management
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", profileRoutes);

// CBT & Student Routes
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));
app.use("/api/exam", examRoutes);
app.use("/api/results", resultRoutes);
app.use('/api/users', userRoutes);

// Admin Management
app.use("/api/admin", adminQuestions);
app.use("/api/admin", adminUpload);
app.use("/api/admin", adminStats);

// 6. CATCH-ALL 404 (MUST BE THE VERY LAST ONE)
app.use((req, res) => {
  // If it's a failed API call, return JSON instead of an HTML file
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  // Otherwise, show your custom 404 page
  res.status(404).sendFile(path.join(__dirname, "404", "404.html"));
});

// 7. SERVER INITIALIZATION
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 RankUp Server deployed successfully on port ${PORT}`);
});