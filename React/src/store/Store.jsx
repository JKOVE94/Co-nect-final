import { configureStore } from "@reduxjs/toolkit";
import combineReducers from "./reducer";

const store = configureStore({
  reducer: combineReducers,
});

export default store;
