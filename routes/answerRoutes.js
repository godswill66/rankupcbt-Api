const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Result = require("../models/Result");
const { protect } = require("../middleware/authMiddleware");

// SUBMIT EXAM ANSWERS
router.post("/submit", protect, async (req, res) => {
  try {
    const { subject, userAnswers } = req.body; 
    
    // 1. Fetch questions
    const questions = await Question.find({ subject });
    
    let score = 0;

    // 2. Process answers
    const processedAnswers = userAnswers.map((ans) => {
      const question = questions.find((q) => q._id.toString() === ans.qId);
      const isCorrect = question && question.correctAnswer === ans.choice;

      if (isCorrect) score++;

      return {
        questionId: ans.qId,
        selectedOption: ans.choice,
        isCorrect: !!isCorrect, // ensures a boolean
      };
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // 3. Save result
    const newResult = new Result({
      user: req.user._id, // Use _id from protect middleware
      subject,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentage: percentage.toFixed(2),
    });

    await newResult.save();

    res.status(201).json({
      message: "Exam submitted successfully",
      score,
      total: totalQuestions,
      percentage: percentage.toFixed(2),
      resultId: newResult._id
    });

  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;