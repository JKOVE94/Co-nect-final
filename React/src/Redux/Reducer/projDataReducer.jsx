import { createSlice } from "@reduxjs/toolkit";

// 리덕스 툴킷의 createSlice를 사용하여 상태 관리
const ResourceSlice = createSlice({
  name: "projData", // Store 설정의 whitelist와 일치하도록 변경
  initialState: {
    proj_pk_num: 0 // 프로젝트 고유 번호
  },
  reducers: {
    // 프로젝트 선택 시 pk num 저장
    PROJSEL: (state, action) => {
      state.proj_pk_num = action.payload.proj_pk_num;
    },
  },
});

// Action과 Reducer 내보내기
export const { PROJSEL } = ResourceSlice.actions;
export default ResourceSlice.reducer; // persistReducer를 제거하고 기본 reducer를 export
