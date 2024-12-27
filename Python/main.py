from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import gemini

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",  # React 앱
    # 필요한 경우 추가 도메인 허용
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(gemini.router, prefix="/api", tags=["gemini"])