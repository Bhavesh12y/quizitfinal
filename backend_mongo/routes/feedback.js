const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../utils/authMiddleware');

// Create feedback
router.post('/', authMiddleware.optional, async (req, res) => {
  try {
    const { userId, username, message, rating } = req.body;
    const fb = new Feedback({ userId, username, message, rating });
    await fb.save();
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read all feedbacks (for admin)
router.get('/', async (req, res) => {
  try {
    const all = await Feedback.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feedback
router.put('/:id', async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
