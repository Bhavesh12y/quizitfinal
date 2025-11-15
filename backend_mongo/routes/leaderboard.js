const express = require("express");
const router = express.Router();
const QuizAttempt = require("../models/QuizAttempt");
const mongoose = require("mongoose");

// GET /api/leaderboard/top
router.get("/top", async (req, res) => {
    try {
        const top = await QuizAttempt.aggregate([

            // Group by user to find best score & attempts
            {
                $group: {
                    _id: "$userId",
                    bestScore: { $max: "$score" },
                    quizCount: { $sum: 1 }
                }
            },

            // Lookup user details
            {
                $lookup: {
                    from: "users",           // collection name (lowercase plural)
                    localField: "_id",       // userId
                    foreignField: "_id",     // users._id
                    as: "user"
                }
            },

            { $unwind: "$user" },

            // Format final output
            {
                $project: {
                    username: "$user.username",
                    displayName: "$user.displayName",
                    bestScore: 1,
                    quizCount: 1
                }
            },

            { $sort: { bestScore: -1 } },
            { $limit: 10 }
        ]);

        res.json(top);

    } catch (err) {
        console.error("Leaderboard Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
