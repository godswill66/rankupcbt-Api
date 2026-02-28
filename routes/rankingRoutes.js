const express = require("express");
const router = express.Router();
const Attempt = require("../models/Attempt");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware").protect;

/**
 * GLOBAL RANKING
 * GET /api/ranking/global
 */
router.get("/global", protect, async (req, res) => {
  try {
    const ranking = await Attempt.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
      {
        $addFields: {
          averageScore: {
            $divide: ["$totalScore", "$totalAttempts"],
          },
        },
      },
      { $sort: { averageScore: -1 } },
    ]);

    const populated = await User.populate(ranking, {
      path: "_id",
      select: "fullName email",
    });

    res.json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * SUBJECT RANKING
 * GET /api/ranking/subject/:subject
 */
router.get("/subject/:subject", protect, async (req, res) => {
    try {
      const ranking = await Attempt.aggregate([
        { $match: { subject: req.params.subject } },
        {
          $group: {
            _id: "$user",
            totalScore: { $sum: "$score" },
            totalAttempts: { $sum: 1 },
          },
        },
        {
          $addFields: {
            averageScore: {
              $divide: ["$totalScore", "$totalAttempts"],
            },
          },
        },
        { $sort: { averageScore: -1 } },
      ]);
  
      const populated = await User.populate(ranking, {
        path: "_id",
        select: "fullName email",
      });
  
      res.json(populated);
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  /**
 * ADD HARDCODED SCORE
 * POST /api/ranking/add-hardcoded
 */
router.post("/add-hardcoded", async (req, res) => {
    try {
      const { userId, subject, score } = req.body;
  
      const attempt = await Attempt.create({
        user: userId,
        subject,
        score,
        totalQuestions: 40,
        duration: 60,
      });
  
      res.json({ message: "Hardcoded score added", attempt });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;