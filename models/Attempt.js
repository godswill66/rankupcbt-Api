const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: String,
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selected: String,
        correct: Boolean,
      },
    ],
    score: Number,
    totalQuestions: Number,
    duration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);