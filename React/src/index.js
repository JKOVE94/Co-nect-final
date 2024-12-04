import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import Dashboard from "layouts/Dashboard";
import Manage from "layouts/Manage";
import Login from "layouts/Login";
import Store from "./Redux/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
const persistor = persistStore(Store);

root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main/*" element={<Dashboard />} />
          <Route path="/manage/*" element={<Manage />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
