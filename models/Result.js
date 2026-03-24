const Result = require('../models/Result');

// SAVE NEW RESULT
exports.saveResult = async (req, res) => {
    try {
        const { userId, scores } = req.body;

        // 1. Calculate Overall Percentage
        // Ensure we don't divide by zero if scores array is empty
        const totalEarned = scores.reduce((sum, s) => sum + s.score, 0);
        const totalPossible = scores.reduce((sum, s) => sum + s.total, 0);
        const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

        // 2. Real-time National Rank Logic 
        const totalStudents = await Result.countDocuments();
        const higherScorers = await Result.countDocuments({ overallScore: { $gt: overallScore } });
        
        const nationalRank = higherScorers + 1;
        
        // 3. Percentile Calculation (handles first-user case)
        let percentile = 100;
        if (totalStudents > 0) {
            percentile = Math.round(((totalStudents - higherScorers) / (totalStudents + 1)) * 100);
        }

        // 4. Create and Save
        const newResult = new Result({
            userId,
            scores,
            overallScore,
            nationalRank,
            percentile
        });

        await newResult.save();
        
        // Return the saved result so the frontend can redirect or show success
        res.status(201).json(newResult);
    } catch (err) {
        console.error("Save Result Error:", err);
        res.status(500).json({ 
            message: "Error saving result", 
            error: err.message 
        });
    }
};

// GET LATEST RESULT FOR UI
exports.getLatestResult = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the most recent result for this specific user
        const result = await Result.findOne({ userId })
            .sort({ createdAt: -1 }) // -1 sorts by newest first
            .populate('userId', 'name email'); // Optional: joins user details if needed

        if (!result) {
            return res.status(404).json({ 
                message: "No exam history found for this user." 
            });
        }
        
        res.json(result);
    } catch (err) {
        console.error("Fetch Result Error:", err);
        res.status(500).json({ 
            message: "Server error while fetching results", 
            error: err.message 
        });
    }
};