const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

router.post("/submit", async (req, res) => {

  const { userAnswers, subject } = req.body;

  const questions = await Question.find({ subject });

  let score = 0;

  userAnswers.forEach(ans => {

    const question = questions.find(q => q._id.toString() === ans.qId);

    if (question && question.correctAnswer === ans.choice) {
      score++;
    }

  });

  res.json({
    score,
    total: questions.length
  });

});

module.exports = router;