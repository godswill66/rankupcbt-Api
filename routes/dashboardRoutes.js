const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// IMPORTANT: You must import your models here!
// Adjust the paths based on your actual folder names
const Attempt = require('../models/Attempt'); 
const Notification = require('../models/Notification'); 

router.get("/", protect, async (req, res) => {
  try {
    // req.user comes from your 'protect' middleware
    const userId = req.user._id;

    // 1. Get all attempts for this user
    const attempts = await Attempt.find({ user: userId }).sort({ createdAt: 1 });

    const totalPractices = attempts.length;
    let totalScore = 0;
    let totalQuestions = 0;

    const subjectMap = {};

    attempts.forEach((attempt) => {
      totalScore += attempt.score;
      totalQuestions += attempt.totalQuestions;

      const percent = Math.round((attempt.score / attempt.totalQuestions) * 100);

      if (!subjectMap[attempt.subject]) {
        subjectMap[attempt.subject] = {
          scores: [],
          dates: [],
          totalQuestionsAnswered: 0
        };
      }

      subjectMap[attempt.subject].scores.push(percent);
      subjectMap[attempt.subject].dates.push(new Date(attempt.createdAt).toLocaleDateString());
      subjectMap[attempt.subject].totalQuestionsAnswered += attempt.totalQuestions;
    });

    // 2. Format Subject Analytics
    const subjectAnalytics = {};
    for (const subject in subjectMap) {
      const data = subjectMap[subject];
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      
      subjectAnalytics[subject] = {
        average: Math.round(avg),
        history: data.scores,
        timeline: data.dates,
        totalQuestions: data.totalQuestionsAnswered 
      };
    }

    // 3. Overall Progress Calculation
    const overallProgress = totalQuestions > 0 
      ? Math.round((totalScore / totalQuestions) * 100) 
      : 0;

    // 4. Latest attempt
    const latestAttempt = await Attempt.findOne({ user: userId }).sort({ createdAt: -1 });
    const latestScore = latestAttempt 
      ? `${latestAttempt.score}/${latestAttempt.totalQuestions}` 
      : "0/0";

    // 5. Notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Final Response
    res.json({
      totalPractices,
      overallProgress,
      latestScore,
      subjectAnalytics,
      // Artificial Rank logic (consider making this dynamic later)
      leaderboardRank: Math.max(5000 - (overallProgress * 20), 1),
      notifications
    });

  } catch (error) {
    console.error("Dashboard Route Error:", error);
    res.status(500).json({ message: "Server error calculating dashboard data" });
  }
});

module.exports = router;