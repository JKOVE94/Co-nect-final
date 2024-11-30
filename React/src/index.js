/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from "layouts/Dashboard";
import Manage from "layouts/Manage";
import Login from "views/Login";
import Store from "./Redux/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main/*" element={<Dashboard />} />
      <Route path="/manage" element={<Manage />} />
    </Routes>
  </BrowserRouter>
  </Provider>
);
