import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Manage from "./components/management/Manage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Landing /> {/* 로그인페이지 컴포넌트 */}
        {/* <Dashboard /> 메인페이지 컴포넌트 */}
        {/* <Mange /> 관리자페이지 컴포넌트 */}
        <Manage />
      </div>

      <Routes>
        {/* <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Dashboard />} />
        <Route path="/manage" element={<Manage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
