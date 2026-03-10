const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },

  question: {
    type: String,
    required: true,
  },

  options: {
    A: String,
    B: String,
    C: String,
    D: String,
  },

  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },

  explanation: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);