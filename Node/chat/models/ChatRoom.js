// models/ChatRoom.js
const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  _id: { // _id 필드 추가 (타입을 String으로 변경)
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["ai", "project", "user"],
  },
  referenceId: {
    type: mongoose.Schema.Types.Mixed,
    required: false, // 1:1 채팅에서는 사용하지 않으므로 false로 설정
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User 모델을 참조하도록 수정 (필요한 경우)
    },
  ],
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);