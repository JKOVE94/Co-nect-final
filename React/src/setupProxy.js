const { createProxyMiddleware } = require("http-proxy-middleware");
const server = process.env.REACT_APP_SERVER_URL;

module.exports = function (app) {
  // 첫 번째 proxy (백엔드 서버)
  app.use(
    "/conect",
    createProxyMiddleware({
      target: `${server}:8080`, // 백엔드 서버 주소 (중괄호 제거)
      changeOrigin: true, // 불린 값으로 수정
    })
  );

  // 두 번째 proxy (GCS)
  app.use(
    "/filestorage", // GCS 버킷 경로로 수정
    createProxyMiddleware({
      target: "https://storage.googleapis.com",
      changeOrigin: true,
    })
  );

  // 세 번째 proxy (채팅)
  app.use(
    "/fn", // chat 경로로 수정
    createProxyMiddleware({
      target: `${server}:5002`,
      changeOrigin: true,
    })
  );
};
