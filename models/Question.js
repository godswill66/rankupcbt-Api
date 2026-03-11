const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  label: String,
  text: String
});

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ["bio", "eng", "math", "phy", "chem"]
  },

  questionText: {
    type: String,
    required: true
  },

  options: [optionSchema],

  correctAnswer: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);