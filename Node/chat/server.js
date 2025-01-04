require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const db = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const setupSocket = require("./utils/socket");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // 클라이언트 주소
    methods: ["GET", "POST"],
  },
});

// MongoDB 연결
db.connect();

// 미들웨어 설정
app.use(express.json());

// 라우트 설정ㅞㅡ
app.use("/api/chat", chatRoutes);

// Socket.IO 설정
setupSocket(io);

// 서버 시작
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));