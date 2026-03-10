const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const adminOnly = require("../middleware/adminMiddleware");

// Add question
router.post("/add-question", adminOnly, async (req, res) => {
  try {
    const { subject, question, options, correctAnswer, explanation } =
      req.body;

    const newQuestion = new Question({
      subject,
      question,
      options,
      correctAnswer,
      explanation,
    });

    await newQuestion.save();

    res.json({
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding question" });
  }
});

module.exports = router;