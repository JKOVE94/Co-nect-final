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
import Landing from "layouts/Login.js";
import Dashboard from "views/Dashboard.js";
import Manage from "views/Manage.js";
import Profile from "views/examples/Profile.js";

var routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Landing />,
  },
  {
    path: "/main",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Dashboard />,
  },
  {
    path: "/admin/manage",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Manage />,
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
  },
];
export default routes;
