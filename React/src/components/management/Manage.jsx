import React, {useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import ManageSidebar from './ManageSidebar';
import UserInfo from './user/UserInfo';

const Manage = () => {
    return(
        <div>
            <ManageSidebar />
            
            <Routes>
                <Route path="/manage/userinfo" element={<UserInfo />} />
            </Routes>
        </div>
    )
}
export default Manage;