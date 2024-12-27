import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";

import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import ManageProjModal from "variables/Modal/ManageProjModal";
import axiosInstance from "api/axiosInstance";

const ProjDetail = (props) => {
  const projPkNumInt = parseInt(useParams().projPkNum, 10);
  const navigate = useNavigate();
  const [proj, setProj] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
  const [type, setType] = useState(""); //모달 타입을 결정하는 state

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${props.compNum}/manage/proj/${projPkNumInt}`
        );
        // console.log(response.data);
        setProj(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // console.log(props.userInfo);
    fetchProj();
  }, [projPkNumInt]);

  const handleDelete = async () => {
    handleShowM();
    setType("delete");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>프로젝트 상세</h2>
        </CardHeader>
        <CardBody
          style={{
            maxHeight: "40em",
            overflowY: "auto",
            fontSize: "1.2rem",
            marginTop: "1em",
          }}
        >
          <div>
            {proj ? (
              <table
                className="table"
                style={{
                  fontSize: "1.2rem",
                  border: "1px solid lightgray",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      제 목
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_title}&nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      담 당 자
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_manager}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      상 태
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_status}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      시 작 일
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_startdate}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      마 감 일
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_enddate}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      멤 버
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.memberDtoList.map((member) => (
                        <span key={member.projmem_pk_num}>
                          {member.projmem_name}&nbsp;
                        </span>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "10%",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      설 명
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {proj.proj_content}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>해당 프로젝트 정보를 찾을 수 없습니다.</div>
            )}
            <br />
            {props.userInfo.user_author == 3 ||
            (props.userInfo.user_author == 2 &&
              proj.proj_fk_user_num == props.userInfo.user_pk_num) ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/manage/proj/update/${projPkNumInt}`)
                  }
                >
                  수정
                </button>
                <button className="btn btn-primary" onClick={handleDelete}>
                  삭제
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/manage/proj")}
            >
              목록
            </button>
          </div>
          <br />
        </CardBody>
      </Card>
      <ManageProjModal
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={type}
        projPkNumInt={projPkNumInt}
        compNum={props.compNum}
        setType={setType}
      />
    </Container>
  );
};

export default ProjDetail;
