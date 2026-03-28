# RankUp CBT API 🚀
> The high-performance backend powering real-time JAMB rankings and academic insights.

This is the official backend service for **RankUp**, a Computer-Based Test (CBT) platform built to help students prepare for examinations with real-time national performance tracking.

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Deployment:** Render

## 🌟 Key Features
- **Real-time Ranking Engine:** Automatically calculates National Rank and Percentile based on every student's performance in the database.
- **Secure Authentication:** Robust user registration and login with encrypted passwords.
- **Dynamic Result Aggregation:** Calculates overall percentages from multiple subject scores.
- **Admin Portal Support:** Specialized routes for organizational oversight.

## 📁 Project Structure
```text
├── config/             # Database connection settings
├── controllers/        # Business logic (Auth, Results, Users)
├── middleware/         # Auth guards and error handlers
├── models/             # Mongoose Schemas (User, Result)
├── routes/             # API Endpoint definitions
└── server.js           # Entry point