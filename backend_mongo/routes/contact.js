const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /api/contact
router.post("/", async (req, res) => {
    try {
        const { name, mail, text } = req.body;

        if (!name || !mail || !text) {
            return res.status(400).json({ error: "All fields required" });
        }

        const newMessage = new Contact({ name, mail, text });
        await newMessage.save();

        res.json({ success: true, message: "Message saved successfully!" });
    } catch (err) {
        console.error("Contact Form Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
