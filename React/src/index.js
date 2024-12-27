import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "assets/landing/css/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "layouts/Dashboard";
import Manage from "layouts/Manage";
import Login from "layouts/Login";
import ProjectSelect from "layouts/ProjectSelect";
import Store from "./Redux/Store";
import ProjHeaders from "components/2dashboard/Headers/ProjHeaders";

const root = ReactDOM.createRoot(document.getElementById("root"));
const persistor = persistStore(Store);

root.render(
  <>
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ProjSel/:id" element={<ProjectSelect />} />
          <Route path="/main/*" element={<Dashboard />} />
          <Route path="/manage/*" element={<Manage />} />
          <Route path="proj/projread/:id" element={<ProjHeaders />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  </>
);
