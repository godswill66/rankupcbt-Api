const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @route   GET /api/admin/practice
 * @desc    Public route for students to get questions by subject
 */
router.get("/practice", async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    // Find 40 random questions for the subject (case-insensitive)
    const questions = await Question.find({ 
      subject: subject.toLowerCase() 
    }).limit(40);

    res.json(questions);
  } catch (err) {
    console.error("Practice Fetch Error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

/**
 * @route   GET /api/admin
 * @desc    Admin only: Get all questions for the dashboard
 */
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin list" });
  }
});

/**
 * @route   POST /api/admin
 * @desc    Admin only: Add a new question
 */
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const { subject, questionText, options, correctAnswer } = req.body;
    const question = new Question({
      subject: subject.toLowerCase(),
      questionText,
      options,
      correctAnswer
    });
    await question.save();
    res.status(201).json({ message: "Question added", question });
  } catch (err) {
    res.status(400).json({ message: "Error saving question" });
  }
});

/**
 * @route   DELETE /api/admin/:id
 * @desc    Admin only: Delete a question
 */
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error" });
  }
});

module.exports = router;