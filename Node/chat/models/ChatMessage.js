const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId 타입으로 설정
      required: true,
      ref: "ChatRoom", // ChatRoom 모델 참조
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);