import { createSlice } from "@reduxjs/toolkit";

// 리덕스 툴킷의 createSlice를 사용하여 상태 관리
const ResourceSlice = createSlice({
  name: "userData", // Store 설정의 whitelist와 일치하도록 변경
  initialState: {
    user_pk_num: 0, // 사용자 고유 번호
    user_name: "", // 사용자 이름
    user_mail: "", // 사용자 이메일
    user_pic: "", // 사용자 프로필 사진
    user_fk_comp_num: 0, // 사용자 회사 번호
    user_author: "" , //사용자 권한
    user_fk_acc_authornum: "" , //사용자 권한
  },
  reducers: {
    // 로그인 시 상태 업데이트
    LOGIN: (state, action) => {
      state.user_pk_num = action.payload.user_pk_num;
      state.user_name = action.payload.user_name;
      state.user_mail = action.payload.user_mail;
      state.user_pic = action.payload.user_pic;
      state.user_fk_comp_num = action.payload.user_fk_comp_num;
      state.user_author = action.payload.user_author;
      state.user_fk_acc_authornum = action.payload. user_fk_acc_authornum;
    },
    // 로그아웃 시 상태 초기화
    LOGOUT: (state) => {
      state.user_pk_num = 0;
      state.user_name = "";
      state.user_mail = "";
      state.user_pic = "";
      state.user_fk_comp_num = 0;
      state.user_author = "";
      state.user_fk_acc_authornum = "";
    },
  },
});

// Action과 Reducer 내보내기
export const { LOGIN, LOGOUT } = ResourceSlice.actions;
export default ResourceSlice.reducer; // persistReducer를 제거하고 기본 reducer를 export
