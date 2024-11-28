import { createSlice } from '@reduxjs/toolkit';

const UserReducer = createSlice({

    name:"resource",

    initialState:{
        usernum:0, 
        authornum:0,
    },

    reducers:{ 
        setUserData:(state, action) => {
            state.usernum = action.payload.user_pk_num;
            state.authornum = action.payload.user_fk_acc_authornum;
        }
    }
});

export const {setUserData} = UserReducer.actions;
export default UserReducer.reducer;
