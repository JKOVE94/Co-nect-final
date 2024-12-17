import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CompanyInfo from "./CompanyInfo";
import "./Company.css";
import CompanyEdit from "./CompanyEdit";
import axios from "axios";

const CompanyHome = () => {
  const [compinfo, setCompinfo] = useState({});
  //   const [editedinfo, setEditedinfo] = useState({});

  const compNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${compNum}/manage/comp`);
      console.log(response.data);
      setCompinfo(response.data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/info"
          element={<CompanyInfo compinfo={compinfo} compNum={compNum} />}
        />
        <Route
          path="/edit/:compNum"
          element={
            <CompanyEdit
              compinfo={compinfo}
              compNum={compNum}
              setCompinfo={setCompinfo}
              fetchData={fetchData}
            />
          }
        />
      </Routes>
    </>
  );
};

export default CompanyHome;
