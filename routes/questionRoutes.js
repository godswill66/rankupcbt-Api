const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET QUESTIONS BY SUBJECT

router.get("/:subject", async (req, res) => {

  const subject = req.params.subject;

  const questions = await Question.find({ subject }).limit(40);

  res.json(questions);

});

module.exports = router;