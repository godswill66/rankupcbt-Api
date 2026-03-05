const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();

const app = express();

// Connect Database
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("RankUp CBT API Running 🚀");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/practice", require("./routes/practiceRoutes"));
app.use("/api/ranking", require("./routes/rankingRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));
app.use("/api/users", profileRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});