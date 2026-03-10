const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));

// Catch-all route for 404
app.use((req, res) => {
    // If you're serving the HTML from a file:
    res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});


app.use(express.json());

// Import Routes
const profileRoutes = require("./routes/profileRoutes");
const adminQuestions = require("./routes/adminQuestions");
const adminUpload = require("./routes/adminUpload");
const adminStats = require("./routes/adminStats");
const examRoutes = require("./routes/exam");

// Root
app.get("/", (req, res) => {
  res.send("RankUp CBT API Running 🚀");
});


// User Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", profileRoutes);

// CBT Routes
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));
app.use("/api/exam", examRoutes);

// Admin Routes
app.use("/api/admin", adminQuestions);
app.use("/api/admin", adminUpload);
app.use("/api/admin", adminStats);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});