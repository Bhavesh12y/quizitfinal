const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');
const authMiddleware = require('../utils/authMiddleware');

// Create attempt (Create)
router.post('/attempt', authMiddleware.optional, async (req, res) => {
  try {
    const { userId, username, category, score, total, answers } = req.body;

    const attempt = new QuizAttempt({
      userId,
      username,
      category,   // ⭐⭐ FIX ⭐⭐
      score,
      total,
      answers,
      attemptedAt: new Date()
    });

    await attempt.save();
    res.json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Read attempts for a user (Read)
router.get('/attempts/:userId', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.params.userId }).sort({ attemptedAt: -1 });
    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update attempt (Update)
router.put('/attempt/:id', async (req, res) => {
  try {
    const updated = await QuizAttempt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete attempt (Delete)
router.delete('/attempt/:id', async (req, res) => {
  try {
    await QuizAttempt.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



// ---- Added by assistant: submit quiz attempt to backend ----
async function submitResult(score, total, answers){
    try{
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user')||'null');
        const body = {
            userId: user ? user.id : null,
            username: user ? user.username : (user ? user.username : 'guest'),
            score: score,
            total: total,
            answers: answers || []
        };
        await fetch('http://localhost:5000/api/quiz/attempt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : ''
            },
            body: JSON.stringify(body)
        });
    }catch(err){
        console.error('submitResult error', err);
    }
}
// Call submitResult(finalScore, totalQuestions) where appropriate in your code when quiz ends.
