const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const ChatRoom = require("../models/ChatRoom");
const axios = require("axios");


// 특정 채팅방의 메시지 목록 가져오기
router.get("/:chatRoomId/messages", async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { type, referenceId } = req.query;

    // MongoDB에서 해당 방의 메시지 조회
    let messages;
    if (type === "ai") {
      // AI 채팅방의 메시지만 조회
      messages = await ChatMessage.find({
        chatRoomId: chatRoomId,
        sender: { $in: ["user", "ai"] }, // 사용자와 AI의 메시지만 선택
      }).sort({ createdAt: 1 });
    } else {
      // 다른 타입의 채팅방 메시지 조회
      messages = await ChatMessage.find({
        chatRoomId: chatRoomId,
      }).sort({ createdAt: 1 });
    }

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI 채팅 API 호출
router.post("/ask-ai", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.get(
      `${process.env.AI_API_URL}${encodeURIComponent(question)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;