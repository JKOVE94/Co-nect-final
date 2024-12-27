import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // 세션 스토리지 사용
import { combineReducers } from "redux";
import userDataReducer from "./Reducer/userDataReducer"; // ResourceSlice에서 export한 reducer
import departDataReducer from "./Reducer/departDataReducer"; // 다른 슬라이스 리듀서
import projDataReducer from "./Reducer/projDataReducer";

// 여러 리듀서를 결합한 rootReducer 생성
const rootReducer = combineReducers({
  userData: userDataReducer, // 사용자 데이터 관리 리듀서
  departData: departDataReducer, // 부서 데이터 관리 리듀서 (예시)
  projData: projDataReducer,
});

// persistConfig 설정 (세션 스토리지 및 유지할 리듀서 설정)
const persistConfig = {
  key: "root",
  version: 1,
  storage, // 세션 스토리지 사용
  whitelist: ["userData","projData"], // 유지할 리듀서 이름 지정 (userData만 저장)
};

// persistReducer로 rootReducer 감싸기
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store 생성 및 미들웨어 설정
const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // redux-persist 관련 액션 무시
      },
    }),
});

// persistor와 Store 내보내기
export const persistor = persistStore(Store);
export default Store;
