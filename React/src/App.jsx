import {  Routes, Route, Router } from "react-router";
import "./App.css";
import ProjCreate from "./components/project/projCreate.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<ProjCreate />} />
        <div className="App">

        </div>
      </Routes>
    </Router>
  );
};

export default App;


/*
    <BrowserRouter>
      <div className="App">
        
        <Landing />  로그인페이지 컴포넌트 
        <Dashboard />  메인페이지 컴포넌트 
        <Mange />  관리자페이지 컴포넌트 
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Dashboard />} />
        <Route path="/manage" element={<Manage />} />
      </Routes>
    </BrowserRouter>*/