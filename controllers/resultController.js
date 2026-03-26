const Result = require("../models/Result");

// SAVE NEW RESULT (Triggered when exam ends)
exports.saveResult = async (req, res) => {
  try {
    const { userId, scores } = req.body;

    // 1. Calculate Overall Percentage
    // .reduce sums up the values. 's' is the individual subject object.
    const totalEarned = scores.reduce((sum, s) => sum + s.score, 0);
    const totalPossible = scores.reduce((sum, s) => sum + s.total, 0);
    
    // Safety check: Avoid dividing by zero if totalPossible is 0
    const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    // 2. National Rank Logic (Comparison against the whole database)
    const totalStudents = await Result.countDocuments();
    const higherScorers = await Result.countDocuments({ overallScore: { $gt: overallScore } });
    
    // Your rank is: (People better than you) + 1
    const nationalRank = higherScorers + 1;
    
    // 3. Percentile Calculation
    let percentile = 100;
    if (totalStudents > 0) {
      // Logic: (Total - People Above) / (Total + current attempt) * 100
      percentile = Math.round(((totalStudents - higherScorers) / (totalStudents + 1)) * 100);
    }

    // 4. Create and Save to MongoDB
    // NOTE: If your Result Schema uses 'user' instead of 'userId', 
    // change the line below to -> user: userId
    const newResult = new Result({
      userId, 
      scores,
      overallScore,
      nationalRank,
      percentile
    });

    await newResult.save();
    
    // Send the saved result back so the frontend knows it was successful
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

    // We find the one newest result for this specific student
    const result = await Result.findOne({ userId })
      .sort({ createdAt: -1 }) // -1 means "Newest First"
      .populate("userId", "fullName email"); // Fills the ID with actual user details

    if (!result) {
      return res.status(404).json({ message: "No results found for this user." });
    }

    res.json(result);
  } catch (err) {
    console.error("Fetch Result Error:", err);
    res.status(500).json({ message: "Server error while fetching results", error: err.message });
  }
};