const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware").protect;

const Attempt = require("../models/Attempt");
const Notification = require("../models/Notification");

// GET Dashboard Data
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all attempts for the user
    const attempts = await Attempt.find({ user: userId });

    const totalPractices = attempts.length;

    let totalScore = 0;
    let totalQuestions = 0;

    // Subject analytics map
    const subjectMap = {};

    attempts.forEach((attempt) => {
      totalScore += attempt.score;
      totalQuestions += attempt.totalQuestions;

      const percent = (attempt.score / attempt.totalQuestions) * 100;

      if (!subjectMap[attempt.subject]) {
        subjectMap[attempt.subject] = [];
      }

      subjectMap[attempt.subject].push(percent);
    });

    // Average score
    const averageScore =
      totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 100)
        : 0;

    // Latest attempt
    const latestAttempt = attempts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    const latestScore = latestAttempt
      ? `${latestAttempt.score}/${latestAttempt.totalQuestions}`
      : "0/0";

    // Subject averages
    const subjectAnalytics = {};

    for (const subject in subjectMap) {
      const arr = subjectMap[subject];
      const avg =
        arr.reduce((sum, val) => sum + val, 0) / arr.length;

      subjectAnalytics[subject] = Math.round(avg);
    }

    // Fake leaderboard rank (until ranking system built)
    const leaderboardRank = Math.max(5000 - averageScore * 20, 1);

    // Notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalPractices,
      averageScore,
      latestScore,
      subjectAnalytics,
      leaderboardRank,
      notifications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;