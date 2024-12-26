const ChatMessage = require("../models/ChatMessage");
const ChatRoom = require("../models/ChatRoom");
const axios = require("axios");
const mongoose = require("mongoose");

const setupSocket = (io) => {
  const chat = io.of("/api/chat");
  chat.on("connection", (socket) => {
    console.log("New client connected to /api/chat", socket.id);

    socket.on(
<<<<<<< HEAD
      "joinRoom",
      async ({ chatRoomId, type, referenceId, user: userPkNum }) => {
        console.log("Received joinRoom event:", {
=======
  "joinRoom",
  async ({ chatRoomId, type, referenceId, user: userPkNum }) => {
    console.log("Received joinRoom event:", {
      chatRoomId,
      type,
      referenceId,
      user: userPkNum,
    });

    // userPkNum을 ObjectId로 변환
    const userObjectId = mongoose.Types.ObjectId.isValid(userPkNum)
      ? new mongoose.Types.ObjectId(userPkNum)
      : null;
    console.log("userObjectId:", userObjectId);

    // 1. 채팅방 존재 여부 확인 (type과 referenceId 사용)
    let chatRoom = await ChatRoom.findOne({
      type: type,
      referenceId: referenceId,
    });
    console.log("Found chatRoom:", chatRoom);

    if (!chatRoom) {
      console.log("Creating new chatRoom...");
      // 새로운 ChatRoom 객체 생성 시, _id를 직접 생성 (ObjectId 타입)
      chatRoom = new ChatRoom({
        _id: new mongoose.Types.ObjectId(), // 수정: _id를 ObjectId로 직접 생성
        type: type,
        referenceId: referenceId,
        participants: userObjectId ? [userObjectId] : [],
      });
      await chatRoom.save();
      console.log("New chatRoom created:", chatRoom);
    } else {
      // 2. 사용자가 이미 참여 중인지 확인
      if (
        userObjectId &&
        !chatRoom.participants.some((participant) =>
          participant.equals(userObjectId)
        )
      ) {
        console.log("Adding user to chatRoom participants...");
        chatRoom.participants.push(userObjectId);
        await chatRoom.save();
        console.log("User added to chatRoom participants:", userObjectId);
      }
    }

    console.log("Joining room:", chatRoom._id.toString());
    try {
      socket.join(chatRoom._id.toString());
      console.log("Rooms after joining:", socket.rooms);
    } catch (error) {
      console.error("Error joining room:", error);
    }

    // 3. 해당 채팅방의 이전 메시지 불러오기 및 클라이언트에게 전송
    const messages = await ChatMessage.find({
      chatRoomId: chatRoom._id,
    })
      .sort({ createdAt: 1 })
      .limit(50);
    socket.emit("loadMessages", messages);
  }
);

    socket.on(
      "sendMessage",
      async ({ chatRoomId, sender, message, type, referenceId }) => {
        console.log("Received sendMessage event:", {
>>>>>>> parent of 69283b5 (2024.12.26 관리자기능 권한 설정, 채팅 v0.8, AI v0.8 완료)
          chatRoomId,
          type,
          referenceId,
          user: userPkNum,
        });

        // userPkNum을 ObjectId로 변환
        const userObjectId = mongoose.Types.ObjectId.isValid(userPkNum)
          ? new mongoose.Types.ObjectId(userPkNum)
          : null;
        console.log("userObjectId:", userObjectId);

        // 1. 채팅방 ID 생성 (type에 따라 분기)
        if (type === "user") {
          // 1:1 채팅방
          const otherUserPkNum = referenceId;
          const sortedUserIds = [
            parseInt(userPkNum),
            parseInt(otherUserPkNum),
          ].sort((a, b) => a - b);
          chatRoomId = `${sortedUserIds[0]}to${sortedUserIds[1]}`;
        } else if (type === "ai") {
          // AI 채팅방 (모든 사용자가 참여하는 단일 채팅방)
          referenceId = "ai_global"; // 고정된 referenceId 사용
          chatRoomId = "ai_global"; // 고정된 chatRoomId 사용
        } else if (type === "project") {
          // 프로젝트 채팅방
          chatRoomId = referenceId;
        }

        // 2. 채팅방 존재 여부 확인 또는 생성 (chatRoomId 사용)
        let chatRoom = await ChatRoom.findOne({ _id: chatRoomId }); // 수정: _id를 사용하여 chatRoomId로 채팅방 검색
        console.log("Found chatRoom:", chatRoom);

        if (!chatRoom) {
          console.log("Creating new chatRoom...");
          chatRoom = new ChatRoom({
            _id: chatRoomId, // 1:1 채팅방 ID 설정
            type: type,
            referenceId: referenceId,
            participants: userObjectId ? [{ user: userObjectId, lastReadTime: new Date() }] : [], // 사용자 정보와 lastReadTime 추가
          });
          await chatRoom.save();
          console.log("New chatRoom created:", chatRoom);
        } else {
          // 3. 사용자가 이미 참여 중인지 확인
          const participantIndex = chatRoom.participants.findIndex(
            (p) => p.user && userObjectId && p.user.equals(userObjectId)
          );

          if (userObjectId && participantIndex === -1) {
            console.log("Adding user to chatRoom participants...");
            chatRoom.participants.push({ user: userObjectId, lastReadTime: new Date() }); // lastReadTime 추가
            await chatRoom.save();
            console.log("User added to chatRoom participants:", userObjectId);
          } else if (userObjectId && participantIndex !== -1) {
            // 사용자가 이미 참여 중인 경우, 마지막으로 읽은 시간 업데이트
            chatRoom.participants[participantIndex].lastReadTime = new Date();
            await chatRoom.save();
          }
        }

        // 4. 채팅방 입장 및 이전 메시지 전송
        console.log("Joining room:", chatRoom._id);
        try {
          socket.join(chatRoom._id);
          console.log("Rooms after joining:", socket.rooms);

          // 5. 해당 채팅방의 이전 메시지 불러오기 및 클라이언트에게 전송
          const messages = await ChatMessage.find({
            chatRoomId: chatRoom._id,
          })
            .sort({ createdAt: 1 })
            .limit(50);
          socket.emit("loadMessages", messages);
        } catch (error) {
          console.error("Error joining room:", error);
        }
      }
    );

    socket.on(
  "sendMessage",
  async ({ chatRoomId, sender, message, type, referenceId }) => {
    console.log("Received sendMessage event:", {
      chatRoomId,
      sender,
      message,
      type,
      referenceId,
    });
    try {
      // 1. 채팅방 찾기 (type과 referenceId 사용)
      // 1:1 채팅방의 경우 chatRoomId를 사용하도록 수정
      const chatRoom =
        type === "user"
          ? await ChatRoom.findOne({ _id: chatRoomId })
          : await ChatRoom.findOne({
              type: type,
              referenceId: referenceId,
            });
      console.log("Found chatRoom:", chatRoom);
      if (!chatRoom) {
        throw new Error("ChatRoom not found");
      }

      // 2. 메시지 저장
      let newMessage = new ChatMessage({
        chatRoomId: chatRoom._id, // 수정: chatRoom._id 사용 (ObjectId 타입)
        sender,
        message,
      });
      await newMessage.save();

      // ChatRoom의 lastMessage 필드 업데이트
      chatRoom.lastMessage = newMessage._id;
      await chatRoom.save();

      console.log("newMessage" + newMessage);
      console.log(newMessage);
      // 3. 다른 클라이언트에게 메시지 전송
      console.log("Sending newMessage to room:", chatRoom._id.toString());
      // chat.to(chatRoom._id.toString()).emit("newMessage", newMessage); // chat.to 사용

      // 4. AI 채팅방인 경우, AI 응답 생성 및 전송
      if (type === "ai") {
        // AI 응답을 기다린 후 메시지 전송
<<<<<<< HEAD
        console.log("sender : " + sender);
        const aiResponse = await generateAiResponse(message, sender); // sender 추가
=======
        const aiResponse = await generateAiResponse(message);
>>>>>>> parent of 69283b5 (2024.12.26 관리자기능 권한 설정, 채팅 v0.8, AI v0.8 완료)
        console.log("AI response:", aiResponse); // AI 응답 확인

        let newAiMessage = new ChatMessage({
          chatRoomId: chatRoom._id,
          sender: "ai",
          message: aiResponse, // 이 부분이 중요합니다.
        });

        console.log("newAiMessage:", newAiMessage); // newAiMessage 객체 확인

        await newAiMessage.save();
        console.log("Sending AI response to room:", chatRoom._id.toString());

        // 두 메시지 (사용자 메시지와 AI 응답 메시지)를 모두 전송
        chat
          .to(chatRoom._id.toString())
          .emit("newMessage", newMessage); // 사용자 메시지 먼저 전송
        chat
          .to(chatRoom._id.toString())
          .emit("newMessage", newAiMessage); // AI 응답 메시지 전송
      } else {
        // AI 채팅방이 아닌 경우, 사용자 메시지만 전송
        console.log("Sending newMessage to room:", chatRoom._id.toString());
        chat.to(chatRoom._id.toString()).emit("newMessage", newMessage);
      }
<<<<<<< HEAD
    } catch (error) {
      console.error("Error sending message:", error);
=======
              } catch (error) {
                console.error("Error sending message:", error);
              }
            }
          );

    // AI 응답 생성 함수
    async function generateAiResponse(question) {
      try {
        console.log("Sending question to AI API:", question);
        console.log(`${process.env.AI_API_URL}${encodeURIComponent(question)}`);
        const response = await axios.get(
          `${process.env.AI_API_URL}${encodeURIComponent(question)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("AI API response:", response.data);

        if (response.data && response.data.answer) {
          return response.data.answer;
        } else {
          console.error("AI API response does not contain 'answer' property.");
          return "죄송해요. 지금은 대답할 수 없어요.";
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
        return "죄송해요. 지금은 대답할 수 없어요.";
      }
>>>>>>> parent of 69283b5 (2024.12.26 관리자기능 권한 설정, 채팅 v0.8, AI v0.8 완료)
    }
  }
);

    socket.on("disconnect", () => {
      console.log("Client disconnected from /api/chat", socket.id);
    });
  });
};

module.exports = setupSocket;