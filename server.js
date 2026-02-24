const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
dotenv.config();

const app = express();

// Import the centralized DB connection function
const connectDB = require('./config/db'); 

// Import the authentication middleware (renamed file/variable)
const authMiddleware = require("./middleware/authMiddleware.js"); 

// importing userRoutes
const userRoutes = require("./routes/userRoutes");

app.use(
  cors({
    origin: "http://127.0.0.1:5501", // My frontend URL
    credentials: true,
  })
);

// Parse incoming JSON payloads from request bodies (e.g., POST/PUT requests)
app.use(express.json());

console.log("Mongo URI being used:", process.env.MONGO_URI);
connectDB(process.env.MONGO_URI); // Use the dedicated connection function

app.get("/", (req, res) => {
  res.send("RankUp CBT API Running 🚀");
});


const authRoutes = require("./routes/authRoutes");

app.use("/api/questions", require("./routes/questionRoutes"));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});