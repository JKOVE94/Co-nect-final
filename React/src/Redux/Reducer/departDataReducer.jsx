import { createSlice } from "@reduxjs/toolkit";
//createSlice를 사용하면 보일러플레이트코드를 생략할 수 있다.

//reducer 파일
//createSlice : 리듀서와 액션을 생성, 초기 상태 정의, 함수 관리, 불변성 관리
const ResourceSlice = createSlice({
  name: "departInfo", //Slice의 이름
  initialState: [],
  reducers: {
    //리듀서 정의, 각 함수는 state와 action을 인자로 받는다.
    SET_DPARTINFO: (state, action) => {
      return action.payload;
    },
    CLEAR_DPARTINFO: (state) => {
      return [];
    },
  },
});

//Action, Reducer 내보내기
export const { SET_DPARTINFO, CLEAR_DPARTINFO } = ResourceSlice.actions; //slice라는 의미처럼 Action를 각각 쪼개서 보내준다.
export default ResourceSlice.reducer; //리듀서를 내보낸다.
