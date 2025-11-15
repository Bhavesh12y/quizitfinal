const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String },
  quizId: { type: String }, // optional: if you have multiple quizzes
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: { type: Array, default: [] },
  attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
