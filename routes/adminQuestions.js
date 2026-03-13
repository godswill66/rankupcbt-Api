const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const adminMiddleware = require("../middleware/adminMiddleware");

// 1. GET ALL QUESTIONS (Used by Dashboard Table)
// URL: GET http://localhost:3001/api/admin
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// 2. ADD NEW QUESTION
// URL: POST http://localhost:3001/api/admin
router.post("/", adminMiddleware, async (req, res) => {
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
    console.error("Save Error:", err);
    res.status(400).json({ message: "Error saving question" });
  }
});

// 3. DELETE QUESTION
// URL: DELETE http://localhost:3001/api/admin/:id
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

module.exports = router;