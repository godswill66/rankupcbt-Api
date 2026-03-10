const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const User = require("../models/user");

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    res.json({
      totalQuestions,
      totalUsers,
      totalAdmins,
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading stats" });
  }
});

module.exports = router;