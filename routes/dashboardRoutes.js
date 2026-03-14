const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const Attempt = require("../models/Attempt");
const Notification = require("../models/Notification");

// GET Dashboard Data
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get all attempts for subject analytics
    const attempts = await Attempt.find({ user: userId });
    const totalPractices = attempts.length;

    let totalScore = 0;
    let totalQuestions = 0;
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

    // 2. Calculate average score (Overall Progress)
    const averageScore =
      totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 100)
        : 0;

    // 3. Get Latest attempt (Optimized DB query)
    const latestAttempt = await Attempt.findOne({ user: userId }).sort({ createdAt: -1 });
    const latestScoreString = latestAttempt
      ? `${latestAttempt.score}/${latestAttempt.totalQuestions}`
      : "0/0";

    // 4. Calculate Subject averages
    const subjectAnalytics = {};
    for (const subject in subjectMap) {
      const arr = subjectMap[subject];
      const avg = arr.reduce((sum, val) => sum + val, 0) / arr.length;
      subjectAnalytics[subject] = Math.round(avg);
    }

    // 5. Fake leaderboard rank
    const leaderboardRank = Math.max(5000 - averageScore * 20, 1);

    // 6. Get Notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // SUCCESS RESPONSE
    res.json({
      totalPractices,
      overallProgress: averageScore, // Matches frontend
      latestScore: latestScoreString,
      subjectAnalytics,
      leaderboardRank,
      notifications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;