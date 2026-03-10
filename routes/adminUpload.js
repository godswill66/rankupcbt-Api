const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");

const Question = require("../models/Question");
const adminOnly = require("../middleware/adminMiddleware");

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload-questions",
  adminOnly,
  upload.single("file"),
  async (req, res) => {
    try {
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const data = XLSX.utils.sheet_to_json(sheet);

      const questions = data.map((row) => ({
        subject: row.subject,
        question: row.question,
        options: {
          A: row.A,
          B: row.B,
          C: row.C,
          D: row.D,
        },
        correctAnswer: row.correctAnswer,
      }));

      await Question.insertMany(questions);

      res.json({
        message: `${questions.length} questions uploaded`,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;