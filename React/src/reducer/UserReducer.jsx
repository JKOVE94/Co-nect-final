import { createSlice } from '@reduxjs/toolkit';

const UserReducer = createSlice({

    name:"resource",

    initialState:{
        usernum:0, 
        authornum:0,
    },

    reducers:{ 
        SET_USER_DATA:(state, action) => {
            state.usernum = action.payload.usernum;
            state.authornum = action.payload.authornum;
        }
    }
});

export const {SET_USER_DATA} = UserReducer.actions;
export default UserReducer.reducer;
