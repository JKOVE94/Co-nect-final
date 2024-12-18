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
import storage from "redux-persist/lib/storage/session";
import { combineReducers } from "redux";
import userDataReducer from "./Reducer/userDataReducer";
import departDataReducer from "./Reducer/departDataReducer";

const rootReducer = combineReducers({
  userData: userDataReducer,
  departData: departDataReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["userData", "departData"], // 유지하고 싶은 리듀서 이름
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(Store);
export default Store;
//
