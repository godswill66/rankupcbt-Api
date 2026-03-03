const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Result = require("../models/Result");
const { protect } = require("../middleware/authMiddleware");

// SUBMIT EXAM ANSWERS
router.post("/submit", protect, async (req, res) => {
  try {
    const { subject, userAnswers } = req.body; // userAnswers = [{ qId: "...", choice: "A" }]
    
    // 1. Fetch all questions for this subject to verify answers server-side
    const questions = await Question.find({ subject });
    
    let totalScore = 0;
    const processedAnswers = [];

    // 2. Compare user answers with the database
    userAnswers.forEach((userAns) => {
      const question = questions.find((q) => q._id.toString() === userAns.qId);
      
      if (question) {
        const isCorrect = question.correctAnswer === userAns.choice;
        if (isCorrect) totalScore += 1;

        processedAnswers.push({
          questionId: userAns.qId,
          selectedOption: userAns.choice,
          isCorrect: isCorrect,
        });
      }
    });

    // 3. Save the result to the database
    const newResult = await Result.create({
      user: req.user.id,
      subject,
      answers: processedAnswers,
      score: totalScore,
      totalQuestions: questions.length,
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      score: totalScore,
      total: questions.length,
      resultId: newResult._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;