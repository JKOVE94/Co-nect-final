import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CompanyInfo from "./CompanyInfo";
import "./Company.css";
import CompanyEdit from "./CompanyEdit";
import axios from "axios";
import axiosInstance from "api/axiosInstance";

const CompanyHome = () => {
  const [compinfo, setCompinfo] = useState({});
  //   const [editedinfo, setEditedinfo] = useState({});

  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `/conect/${compNum}/manage/comp`
      );
      // console.log(response.data);
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
          element={
            <CompanyInfo
              compinfo={compinfo}
              compNum={compNum}
              userAuthor={userInfo.user_author}
            />
          }
        />
        {userInfo.user_author == 3 ? (
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
        ) : (
          ""
        )}
      </Routes>
    </>
  );
};

export default CompanyHome;
