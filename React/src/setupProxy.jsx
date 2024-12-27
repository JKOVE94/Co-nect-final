const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // 첫 번째 proxy (백엔드 서버)
  app.use(
    "/conect",
    createProxyMiddleware({
      target: "http://localhost:8080", // 백엔드 서버 주소 (중괄호 제거)
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

  // 세 번째 proxy (AI 서버)
  app.use(
    "/api/ai", // AI 서버 주소로 수정
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );

  // 네 번째 proxy (채팅)
  app.use(
    "/api/chatt", // AI 서버 주소로 수정
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
};
