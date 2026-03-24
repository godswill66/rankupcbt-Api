const Result = require("../models/Result");

// SAVE NEW RESULT (Triggered when exam ends)
exports.saveResult = async (req, res) => {
  try {
    const { userId, scores } = req.body;

    // 1. Calculate Overall Percentage
    const totalEarned = scores.reduce((sum, s) => sum + s.score, 0);
    const totalPossible = scores.reduce((sum, s) => sum + s.total, 0);
    const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    // 2. National Rank Logic (Compare against all other results)
    const totalStudents = await Result.countDocuments();
    const higherScorers = await Result.countDocuments({ overallScore: { $gt: overallScore } });
    
    const nationalRank = higherScorers + 1;
    
    // 3. Percentile Calculation
    let percentile = 100;
    if (totalStudents > 0) {
      percentile = Math.round(((totalStudents - higherScorers) / (totalStudents + 1)) * 100);
    }

    const newResult = new Result({
      userId,
      scores,
      overallScore,
      nationalRank,
      percentile
    });

    await newResult.save();
    res.status(201).json(newResult);
  } catch (err) {
    console.error("Save Result Error:", err);
    res.status(500).json({ message: "Error saving result", error: err.message });
  }
};

// GET LATEST RESULT (Triggered when Detailed Analysis page loads)
exports.getLatestResult = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Result.findOne({ userId })
      .sort({ createdAt: -1 }) // Gets the most recent attempt
      .populate("userId", "name email"); // Grabs user name if needed

    if (!result) {
      return res.status(404).json({ message: "No results found for this user." });
    }

    res.json(result);
  } catch (err) {
    console.error("Fetch Result Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};