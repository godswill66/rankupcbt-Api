const Result = require("../models/Result");
const mongoose = require("mongoose");

// SAVE NEW RESULT
exports.saveResult = async (req, res) => {
  try {
    const { userId, scores } = req.body;

    // Calculate Scores
    const totalEarned = scores.reduce((sum, s) => sum + s.score, 0);
    const totalPossible = scores.reduce((sum, s) => sum + s.total, 0);
    const overallScore =
      totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    // Ranking Logic
    const totalStudents = await Result.countDocuments();
    const higherScorers = await Result.countDocuments({
      overallScore: { $gt: overallScore },
    });
    const nationalRank = higherScorers + 1;

    let percentile = 100;
    if (totalStudents > 0) {
      percentile = Math.round(
        ((totalStudents - higherScorers) / (totalStudents + 1)) * 100,
      );
    }

    const newResult = new Result({
      userId,
      scores,
      overallScore,
      nationalRank,
      percentile,
    });

    await newResult.save();
    res.status(201).json(newResult);
  } catch (err) {
    console.error("Save Result Error:", err);
    res
      .status(500)
      .json({ message: "Error saving result", error: err.message });
  }
};

// GET LATEST RESULT
exports.getLatestResult = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const result = await Result.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email");

    if (!result) {
      return res
        .status(404)
        .json({ message: "No exam history found for this user." });
    }

    res.json(result);
  } catch (err) {
    console.error("Fetch Result Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
