import React from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CompanyInfo = (props) => {
  const nav = useNavigate();

  const handleEditCompany = () => {
    nav(`/manage/company/edit/${props.compNum}`);
  };

  return (
    <Card>
      <CardHeader>
        <h2>회사 정보</h2>
        {props.userAuthor == 3 ? (
          <button
            className="btn btn-primary"
            onClick={() => handleEditCompany()}
          >
            수정
          </button>
        ) : (
          ""
        )}
      </CardHeader>
      <CardBody>
        <table className="CompanyInfo">
          <tbody>
            <tr>
              <td>회사명 : </td>
              <td>{props.compinfo.comp_name}</td>
            </tr>
            <tr>
              <td>주소 : </td>
              <td>{props.compinfo.comp_addr} </td>
            </tr>
            <tr>
              <td>연락처 : </td>
              <td>{props.compinfo.comp_tel} </td>
            </tr>
            <tr>
              <td>웹사이트 : </td>
              <td>{props.compinfo.comp_website} </td>
            </tr>
            <tr>
              <td>총 사원수 : </td>
              <td>{props.compinfo.comp_totalEmp} </td>
            </tr>
            <tr>
              <td>프로젝트 수 : </td>
              <td>
                &nbsp; {props.compinfo.comp_totalProject}개 (진행중 :&nbsp;
                {props.compinfo.comp_totalProject -
                  props.compinfo.comp_completeProject}{" "}
                / 완료 : {props.compinfo.comp_completeProject})
              </td>
            </tr>
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default CompanyInfo;
