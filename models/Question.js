const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        label: String, // A, B, C, D
        text: String,
      },
    ],
    correctAnswer: {
      type: String, // A, B, C, D
      required: true,
    },
  },
    { _id: true }
);

module.exports = mongoose.model("Question", questionSchema);