const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  scores: [
    {
      subject: { type: String, required: true },
      score: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  overallScore: { type: Number, required: true }, // e.g., 78
  nationalRank: { type: Number },
  percentile: { type: Number }, // e.g., "Better than 72% of students"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);