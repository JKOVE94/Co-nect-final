import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjCreate from "./components/project/projCreate.jsx";
import ProjUpdate from "./components/project/projUpdate.jsx";
// import './assets/css/argon-dashboard-react.css';
// import './assets/css/argon-dashboard-react.css.map';
// import './assets/css/argon-dashboard-react.min.css';

// //import './assets/css/plugins/css/nucleo-svg.css'; 
// //import './assets/css/plugins/css/nucleo.css';

// import './assets/scss/argon-dashboard/custom/_alert.scss';
// import './assets/scss/argon-dashboard/custom/_avatar.scss';
// import './assets/scss/argon-dashboard/custom/_variables.scss';
// import './assets/scss/argon-dashboard/custom/_mixins.scss';
// //import 
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjCreate />} />
        <Route path="/update" element={<ProjUpdate />} />
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