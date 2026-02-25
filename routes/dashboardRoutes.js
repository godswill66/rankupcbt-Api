const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware").protect;
const Attempt = require("../models/Attempt");
const Notification = require("../models/Notification");

// GET Dashboard Data
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await Attempt.find({ user: userId });

    const totalAttempts = attempts.length;

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    const overallProgress = totalAttempts
      ? Math.round(totalScore / totalAttempts)
      : 0;

    const recentAttempt = attempts.sort(
      (a, b) => b.createdAt - a.createdAt
    )[0];

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalAttempts,
      overallProgress,
      recentScore: recentAttempt ? recentAttempt.score : 0,
      notifications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;