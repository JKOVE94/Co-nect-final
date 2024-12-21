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
      const response = await axios.get(`/${compNum}/manage/comp`);
      // console.log(response.data);
      setCompinfo(response.data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  function downloadFileWithFetch(filepath) {
    const baseUrl = "https://storage.cloud.google.com/co-nect/emp_pic/";
    const filename = filepath.split("/").pop();
    const url = baseUrl + filename;

    fetch(url, { mode: "cors" }) // mode: 'cors' 옵션 추가
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

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
      <a
        href="#"
        onClick={() =>
          downloadFileWithFetch(
            "https://storage.cloud.google.com/co-nect/emp_pic/1_100"
          )
        }
        // download={true}
      >
        {" "}
        사진
      </a>
    </>
  );
};

export default CompanyHome;
