const express = require("express");
const router = express.Router();
const QuizAttempt = require("../models/QuizAttempt");
const mongoose = require("mongoose");

// GET /api/leaderboard/top
router.get("/top", async (req, res) => {
    try {
        const top = await QuizAttempt.aggregate([

            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    bestScore: { $max: "$score" },
                    quizCount: { $sum: 1 }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            { $unwind: "$user" },

            {
                $project: {
                    username: "$user.username",
                    displayName: "$user.displayName",
                    totalScore: 1,
                    bestScore: 1,
                    quizCount: 1
                }
            },

            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        res.json(top);

    } catch (err) {
        console.error("Leaderboard Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
