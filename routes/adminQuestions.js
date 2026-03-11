const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ADD QUESTION
router.post("/questions", async (req, res) => {
  try {

    const { subject, questionText, options, correctAnswer } = req.body;

    const question = new Question({
      subject,
      questionText,
      options,
      correctAnswer
    });

    await question.save();

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL QUESTIONS (ADMIN TABLE)
router.get("/questions", async (req, res) => {

  const questions = await Question.find().sort({ createdAt: -1 });

  res.json(questions);

});

// DELETE QUESTION
router.delete("/questions/:id", async (req, res) => {

  await Question.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted successfully" });

});

module.exports = router;