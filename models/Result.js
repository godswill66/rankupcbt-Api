const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This is the 'link' that allows populate to work
    required: true
  },
  scores: [
    {
      subject: String,
      score: Number,
      total: Number
    }
  ],
  overallScore: { type: Number, default: 0 },
  nationalRank: { type: Number },
  percentile: { type: Number },
}, { timestamps: true });

module.exports = mongoose.models.Result || mongoose.model("Result", resultSchema);