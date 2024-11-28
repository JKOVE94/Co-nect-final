import { BrowserRouter, Routes, Route, Link } from "react-router";
import "./App.css";
import Function from "./components/function/Function";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';

const App = () => {

  const dispatch = useDispatch();

  useEffect({

  },[])

  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/main">메인</Link>
        <Link to="/function">업무 관리</Link>
      </div>
      <Routes>
        <Route path="/main" element={<div></div>} />
        <Route path="/function" element={<Function />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
