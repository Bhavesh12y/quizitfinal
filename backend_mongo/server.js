/**
 * Express server with MongoDB (Mongoose) integration.
 * - Auth: signup / signin (passwords stored hashed with bcrypt)
 * - QuizAttempt: store user's quiz attempts (Create + Read + Update + Delete)
 * - Feedback: CRUD for feedback
 * - Leaderboard: aggregated from attempts (Read)
 *
 * To run:
 * 1) In backend_mongo: npm init -y
 * 2) npm install express mongoose bcryptjs jsonwebtoken cors body-parser
 * 3) Set environment variable MONGO_URI to your MongoDB Atlas connection string.
 * 4) node server.js
 *
 * Note: replace JWT_SECRET with a secure secret in production.
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const feedbackRoutes = require('./routes/feedback');
const leaderboardRoutes = require('./routes/leaderboard');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGO_URI || '<PASTE_YOUR_MONGODB_URI_HERE>';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use("/api/contact", require("./routes/contact"));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
