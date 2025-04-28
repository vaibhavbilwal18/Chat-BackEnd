const express = require("express");
const { Chat } = require("../models/chat");
const { auth } = require("../middleware/userauth");
const router = express.Router();

router.get("/chat/:userId/:targetUserId", auth, async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("participants", "firstName lastName email");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/chat/sendMessage", auth, async (req, res) => {
  try {
    const { senderId, targetUserId, text } = req.body;

    if (!senderId || !targetUserId || !text) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    let chat = await Chat.findOne({
      participants: { $all: [senderId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, targetUserId],
        messages: [],
      });
    }

    chat.messages.push({
      senderId,
      text,
    });

    await chat.save();
    res.status(200).json({ message: "Message sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
