import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Landing from "./components/common/Landing";
import Dashboard from "./components/common/Dashboard";
import Manage from "./components/management/Manage";
import Header from "./components/headers/Header";
import Projtable from "./components/project/Projtable";

const App = () => {
  return (
    <div className="App">
      <Dashboard /> {/* 로그인페이지 컴포넌트 */}
      <Projtable />
    </div>
  );
};

export default App;
