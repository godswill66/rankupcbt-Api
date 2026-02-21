const express = require("express");
const Question = require("../models/Question");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();


// ADD QUESTION (Admin Only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { subject, questionText, options, correctAnswer } = req.body;

    const question = await Question.create({
      subject,
      questionText,
      options,
      correctAnswer,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET QUESTIONS BY SUBJECT
router.get("/:subject", protect, async (req, res) => {
  try {
    const questions = await Question.find({
      subject: req.params.subject,
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
