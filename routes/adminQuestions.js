const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const adminMiddleware = require("../middleware/adminMiddleware");

// 1. STUDENT PRACTICE ROUTE (Public/User)
// This matches: GET /api/admin/practice?subject=bio
router.get("/practice", async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    // Find questions matching the subject (case-insensitive)
    const questions = await Question.find({ 
      subject: subject.toLowerCase() 
    }).limit(40);

    // If no questions found, return empty array so frontend shows "No questions yet"
    res.json(questions);
  } catch (err) {
    console.error("Practice Fetch Error:", err);
    res.status(500).json({ message: "Error fetching practice questions" });
  }
});

// 2. ADMIN: GET ALL QUESTIONS (For Dashboard Table)
// This matches: GET /api/admin
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// 3. ADMIN: ADD NEW QUESTION
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
    res.status(201).json({ message: "Question added successfully", question });
  } catch (err) {
    res.status(400).json({ message: "Error saving question" });
  }
});

// 4. ADMIN: DELETE QUESTION
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error" });
  }
});

module.exports = router;