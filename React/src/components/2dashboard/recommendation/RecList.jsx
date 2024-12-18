  import axios from "axios";
  import { useEffect, useState } from "react";
  import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
  } from "react-bootstrap";
  import { useSelector } from "react-redux";
  import { Link, useNavigate, useParams } from "react-router-dom";

  const RecList = () => {
  
      const [datas, setDatas] = useState([]);
      const compNum = JSON.parse(
        sessionStorage.getItem("persist:userInfo")
      ).user_fk_comp_num;
      const { projPkNum } = useParams(); ///:projPkNum으로 넘어온 값 가져오기
  
      const getData = async () => {
          axios.get(`/${compNum}/rec/${projPkNum}`)
              .then((res) => {
                  setDatas(res.data);
              })
              .catch((err)=>console.log(err));
      }

      const navigate = useNavigate();
  
      useEffect(()=>{
          getData();
      },[])
  
  
    return (
      <>
        <Row className="mx-0 align-items-start justify-content-center">
          <Col>
            <Card>
              <CardHeader
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2>건의사항 게시판</h2>
              </CardHeader>
              <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th style={{ cursor: "pointer" }}>
                    작성일
                </th>
                <th style={{ cursor: "pointer" }}>
                  좋아요수
                </th>
                <th style={{ cursor: "pointer" }}>
                  조회수
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.length > 0 ? (
                datas.map((data, index) => (
                  <tr key={index}>
                    <td> {data.rec_pk_num} </td>
                    <td> <Link to={`./detail/${data.rec_pk_num}`}> {data.rec_title} </Link> </td>
                    <td> {data.rec_regdate} </td>
                    <td> {data.rec_likes} </td>
                    <td> {data.rec_view} </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">작성된 건의사항이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`./create`)}
          >
            건의사항 등록
          </button>
        </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  };
  export default RecList;
  