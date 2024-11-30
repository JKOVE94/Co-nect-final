import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./Reducer/userDataReducer";

const Store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

export default Store;
