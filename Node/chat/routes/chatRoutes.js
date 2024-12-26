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

router.get("/rooms/summary", async (req, res) => {
  try {
    const userInfo = JSON.parse(req.headers.authorization);
    const userPkNum = userInfo.user_pk_num;

    // 사용자가 참여하고 있는 채팅방 목록 가져오기
    const chatRooms = await ChatRoom.find({
      "participants.user": userPkNum,
    })
      .populate({
        path: "lastMessage", // ChatRoom의 lastMessage 필드 채우기
        select: "message createdAt", // ChatMessage에서 message와 createdAt 필드만 선택
      })
      .exec();

    const roomSummaries = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        // 안 읽은 메시지 개수 계산
        const unreadCount = await ChatMessage.countDocuments({
          chatRoomId: chatRoom._id,
          createdAt: { $gt: chatRoom.participants.find(p => p.user.toString() === userPkNum).lastReadTime || 0 },
        });

        return {
          chatRoomId: chatRoom._id,
          type: chatRoom.type,
          referenceId: chatRoom.referenceId, // 이부분은 1:1 채팅방에서 사용되는 chatRoomId를 생성하는데 쓰입니다.
          title: chatRoom.title,
          lastMessage: chatRoom.lastMessage
            ? chatRoom.lastMessage.message
            : null,
          lastMessageTime: chatRoom.lastMessage
            ? chatRoom.lastMessage.createdAt
            : null,
          unreadCount,
        };
      })
    );

    res.status(200).json(roomSummaries);
  } catch (err) {
    console.error("Error fetching room summaries:", err);
    res.status(500).json({ message: "Error fetching room summaries" });
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