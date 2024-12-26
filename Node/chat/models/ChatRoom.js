const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  _id: {
    // _id 필드 (String 타입, 1:1 채팅방 ID 생성 규칙 사용)
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["ai", "project", "user"],
  },
  referenceId: {
    // type이 "project"일 때만 사용
    type: mongoose.Schema.Types.Mixed,
    required: false, // 1:1 채팅에서는 사용하지 않으므로 false로 설정
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      lastReadTime: {
        // 마지막으로 메시지를 읽은 시간 저장
        type: Date,
        default: null,
      },
    },
  ],
  lastMessage: {
    // 마지막 메시지
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMessage",
  },
});

// populate 사용을 위한 virtual 속성 정의 (Optional)
// ChatRoomSchema.virtual("lastMessageInfo", {
//   ref: "ChatMessage",
//   localField: "lastMessage",
//   foreignField: "_id",
//   justOne: true, // 단일 객체만 가져옴
// });

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);