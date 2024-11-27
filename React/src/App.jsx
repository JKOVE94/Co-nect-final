import { BrowserRouter, Routes, Route, Link } from "react-router";
import "./App.css";
import Function from "./components/function/Function";

const App = () => {
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
