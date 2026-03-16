const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// 1. IMPORT THE MIDDLEWARE (This was the missing piece!)
const adminMiddleware = require("../middleware/adminMiddleware");

// --- PUBLIC/STUDENT ROUTES ---

// GET /api/admin/practice?subject=bio
router.get("/practice", async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const questions = await Question.find({ 
      subject: subject.toLowerCase() 
    }).limit(40);

    res.json(questions);
  } catch (err) {
    console.error("Practice Fetch Error:", err);
    res.status(500).json({ message: "Error fetching practice questions" });
  }
});

// --- ADMIN ROUTES (Protected by adminMiddleware) ---

// GET /api/admin (Get all for dashboard)
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// POST /api/admin (Add new)
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

// DELETE /api/admin/:id
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error" });
  }
});

module.exports = router;
// 1. GET QUESTIONS (Filtered by subject)

// Change 'adminMiddleware' to 'protect' so students can access it too
router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject.toLowerCase();
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    if (questions.length === 0) {
      // This triggers the "No questions found" on your frontend
      return res.status(200).json([]); 
    }

    res.json(questions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});// 1. GET QUESTIONS (Filtered by subject)
// Change 'adminMiddleware' to 'protect' so students can access it too
router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject.toLowerCase();
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    if (questions.length === 0) {
      // This triggers the "No questions found" on your frontend
      return res.status(200).json([]); 
    }

    res.json(questions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});// 1. GET QUESTIONS (Filtered by subject)
// Change 'adminMiddleware' to 'protect' so students can access it too
router.get("/", async (req, res) => {
  try {
    const { subject } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject.toLowerCase();
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    if (questions.length === 0) {
      // This triggers the "No questions found" on your frontend
      return res.status(200).json([]); 
    }

    res.json(questions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});