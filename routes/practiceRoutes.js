const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const protect = require("../middleware/authMiddleware").protect;

/**
 * GET Questions by Subject
 * GET /api/practice/:subject
 */
router.get("/:subject", protect, async (req, res) => {
  try {
    const questions = await Question.find({
      subject: req.params.subject,
    }).limit(40);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * SUBMIT TEST
 * POST /api/practice/submit
 */
router.post("/submit", protect, async (req, res) => {
  try {
    const { subject, answers, duration } = req.body;

    let score = 0;

    const gradedAnswers = [];

    for (const item of answers) {
      const question = await Question.findById(item.questionId);

      const isCorrect = question.correctAnswer === item.selected;

      if (isCorrect) score++;

      gradedAnswers.push({
        question: question._id,
        selected: item.selected,
        correct: isCorrect,
      });
    }

    const attempt = await Attempt.create({
      user: req.user._id,
      subject,
      answers: gradedAnswers,
      score,
      totalQuestions: answers.length,
      duration,
    });

    res.json({
      message: "Test submitted successfully",
      score,
      total: answers.length,
      attemptId: attempt._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;