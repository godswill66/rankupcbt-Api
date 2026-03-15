router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get all attempts for this user, sorted by date (oldest to newest for the chart)
    const attempts = await Attempt.find({ user: userId }).sort({ createdAt: 1 });

    const totalPractices = attempts.length;
    let totalScore = 0;
    let totalQuestions = 0;

    // This map will store everything we need per subject
    const subjectMap = {};

    attempts.forEach((attempt) => {
      totalScore += attempt.score;
      totalQuestions += attempt.totalQuestions;

      const percent = Math.round((attempt.score / attempt.totalQuestions) * 100);

      if (!subjectMap[attempt.subject]) {
        subjectMap[attempt.subject] = {
          scores: [],
          dates: [],
          totalQuestionsAnswered: 0
        };
      }

      subjectMap[attempt.subject].scores.push(percent);
      subjectMap[attempt.subject].dates.push(new Date(attempt.createdAt).toLocaleDateString());
      subjectMap[attempt.subject].totalQuestionsAnswered += attempt.totalQuestions;
    });

    // 2. Format Subject Analytics for the UI
    const subjectAnalytics = {};
    for (const subject in subjectMap) {
      const data = subjectMap[subject];
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      
      subjectAnalytics[subject] = {
        average: Math.round(avg),
        history: data.scores, // Array for dropdowns
        timeline: data.dates, // Labels for Chart
        totalQuestions: data.totalQuestionsAnswered // For "Total Answered" display
      };
    }

    // 3. Overall Progress
    const overallProgress = totalQuestions > 0 
      ? Math.round((totalScore / totalQuestions) * 100) 
      : 0;

    // 4. Latest attempt (Optimized)
    const latestAttempt = await Attempt.findOne({ user: userId }).sort({ createdAt: -1 });
    const latestScore = latestAttempt 
      ? `${latestAttempt.score}/${latestAttempt.totalQuestions}` 
      : "0/0";

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

    res.json({
      totalPractices,
      overallProgress,
      latestScore,
      subjectAnalytics,
      leaderboardRank: Math.max(5000 - overallProgress * 20, 1),
      notifications
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});