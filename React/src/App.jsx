import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjCreate from "./components/project/projCreate.jsx";
import ProjRead from "./components/project/projRead.jsx";
import ProjUpdate from "./components/project/projUpdate.jsx";

import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board/projadd" element={<ProjCreate />} />
        <Route path="/board/projread/:projPkNum" element={<ProjRead />} />
        <Route path="/board/projedit/:projPkNum" element={<ProjUpdate />} />
      </Routes>
    </BrowserRouter>
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