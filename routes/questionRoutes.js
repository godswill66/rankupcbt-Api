const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const adminMiddleware = require("../middleware/adminMiddleware");

// PUBLIC: Get questions for the quiz
router.get("/practice/:subject", async (req, res) => {
  const { subject } = req.params;
  const questions = await Question.find({ subject }).limit(40);
  res.json(questions);
});

// ADMIN ONLY: Get all questions for the dashboard table
router.get("/admin/all", adminMiddleware, async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

// ADMIN ONLY: Add a new question
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: "Error saving question" });
  }
});

// ADMIN ONLY: Delete a question
router.delete("/:id", adminMiddleware, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted" });
});

module.exports = router;