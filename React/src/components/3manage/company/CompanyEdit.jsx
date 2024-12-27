import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "api/axiosInstance";

const CompanyEdit = (props) => {
  const nav = useNavigate();

  const handleSubmitEditting = async () => {
    let comp_name = document.getElementById("comp_name").value;
    let comp_addr = document.getElementById("comp_addr").value;
    let comp_tel = document.getElementById("comp_tel").value;
    let comp_website = document.getElementById("comp_website").value;
    const compinfo = { comp_name, comp_addr, comp_tel, comp_website };
    await fetchUpdate(compinfo);
    await props.fetchData();
    nav("/manage/company/info");
  };

  const fetchUpdate = async (compinfo) => {
    await axiosInstance.put(`/conect/${props.compNum}/manage/comp`, compinfo);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h2>회사 정보 수정</h2>
          <button
            className="btn btn-primary"
            onClick={() => handleSubmitEditting()}
          >
            수정 완료
          </button>
        </CardHeader>
        <CardBody>
          <div className="CompanyEdit">
            <form>
              <label htmlFor="comp_name">회사명</label>
              <br />
              <input
                type="text"
                name="comp_name"
                id="comp_name"
                defaultValue={props.compinfo.comp_name}
              ></input>
              <br />
              <label htmlFor="comp_addr">주소</label>
              <br />
              <input
                type="text"
                name="comp_addr"
                id="comp_addr"
                defaultValue={props.compinfo.comp_addr}
              ></input>
              <br />
              <label htmlFor="comp_tel">연락처</label>
              <br />
              <input
                type="text"
                name="comp_tel"
                id="comp_tel"
                defaultValue={props.compinfo.comp_tel}
              ></input>
              <br />
              <label htmlFor="comp_website">웹사이트</label>
              <br />
              <input
                type="text"
                name="comp_website"
                id="comp_website"
                defaultValue={props.compinfo.comp_website}
              ></input>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CompanyEdit;
