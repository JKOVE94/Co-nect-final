import { createSlice } from "@reduxjs/toolkit";
//createSlice를 사용하면 보일러플레이트코드를 생략할 수 있다.

//reducer 파일
//createSlice : 리듀서와 액션을 생성, 초기 상태 정의, 함수 관리, 불변성 관리
const ResourceSlice = createSlice({
  name: "userInfo", //Slice의 이름
  initialState: {
    //공유자원 정의
    user_pk_num: 0,
    user_name: "",
    user_mail: "",
    user_pic: "",
    user_rank: "",
    user_fk_dpart_num: 0,
    user_fk_acc_authornum: 0,
    user_fk_comp_num: 0,
  },
  reducers: {
    //리듀서 정의, 각 함수는 state와 action을 인자로 받는다.
    LOGIN: (state, action) => {
      state.user_pk_num = action.payload.user_pk_num;
      state.user_name = action.payload.user_name;
      state.user_mail = action.payload.user_mail;
      state.user_pic = action.payload.user_pic;
      state.user_rank = action.payload.user_rank;
      state.user_fk_dpart_num = action.payload.user_fk_dpart_num;
      state.user_fk_acc_authornum = action.payload.user_fk_acc_authornum;
      state.user_fk_comp_num = action.payload.user_fk_comp_num;
    },
    LOGOUT: (state) => {
      state.user_pk_num = 0;
      state.user_name = "";
      state.user_mail = "";
      state.user_pic = "";
      state.user_rank = "";
      state.user_fk_dpart_num = 0;
      state.user_fk_acc_authornum = 0;
      state.user_fk_comp_num = 0;
    },
  },
});

//Action, Reducer 내보내기
export const { LOGIN, LOGOUT } = ResourceSlice.actions; //slice라는 의미처럼 Action를 각각 쪼개서 보내준다.
export default ResourceSlice.reducer; //리듀서를 내보낸다.
