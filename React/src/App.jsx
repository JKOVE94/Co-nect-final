import { BrowserRouter, Routes, Route, Link } from "react-router";
import "./App.css";
import Function from "./components/function/Function";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import Session from 'react-session-api';
import {SET_USER_DATA} from './reducer/UserReducer';
import Error from "./components/function/Error";

const App = () => {

  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const fetchData = async () => {
    const userData = {
      usernum: await Session.get('usernum'),
      authornum: await Session.get('authornum'),
    };
    setData(userData);
    dispatch(SET_USER_DATA(userData));
  };

  useEffect(() => {
    //로그인 성공 시 진행할 코드
    Session.set('usernum',10);
    Session.set('authornum','user');
    //
    fetchData();
  }, [dispatch]);
    
  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/main">메인</Link><br/>
        <Link to="/function">업무 관리</Link><br/>
        <Link to="/error?msg=err">에러 테스트</Link><br/>
      </div>
      <Routes>
        <Route path="/main" element={<div></div>} />
        <Route path="/error" element={<Error />} />
        <Route path="/function" element={<Function />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
