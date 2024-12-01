import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./Reducer/userDataReducer";
import departDataReducer from "./Reducer/departDataReducer";

const Store = configureStore({
  reducer: {
    userData: userDataReducer,
    departData: departDataReducer,
  },
});

export default Store;
