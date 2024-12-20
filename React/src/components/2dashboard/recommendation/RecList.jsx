import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Pagination,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const RecList = () => {
  const [datas, setDatas] = useState({});
  const [mostLike, setMostLike] = useState({});
  const [sortField, setSortField] = useState("recRegdate");
  const [sortDirection, setSortDirection] = useState("desc");
  const compNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  const { projPkNum } = useParams(); ///:projPkNum으로 넘어온 값 가져오기
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    setLoading(true);
    axios
      .get(`/${compNum}/rec/${projPkNum}`, {
        params: {
          // 원하는 파라미터를 여기에 추가
          sortField: sortField,       
          sortDirection: sortDirection,
          size : 10,
          page: currentPage
        }
      })
      .then((res) => {
        if(res.data.pageable.pageNumber === 0) {
          const max = Math.max(...res.data.content.map((data) => data.rec_likes));
          setMostLike(res.data.content.find((data) => data.rec_likes === max));
        }
        
        setDatas(res.data);
        setLoading(false);
      })
      .catch((err) => {console.log(err);
        setLoading(false);});
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };

  const navigate = useNavigate();

  const handleSort = (field) => {
    
    if(sortField !== field ) {
      setSortField(field); 
      setSortDirection("desc"); 
    } else {
      sortDirection === "asc" ? setSortDirection("desc") : setSortDirection("asc")
    }

  }
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getData();
  }, [sortField, sortDirection, currentPage]);

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
              {loading? (<div>로딩 중 ...</div>):(
              <table className="table" style={{ fontSize: "1.2rem" }}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("recRegdate")}>
                      작성일
                      <Badge bg="light">
                        {sortField === "recRegdate" && (sortDirection === "desc" ? "▼" : "▲")}
                      </Badge>
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("recLikes")}>
                      좋아요수
                      <Badge bg="light">
                        {sortField === "recLikes" && (sortDirection === "desc" ? "▼" : "▲")}
                      </Badge>
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("recView")}>
                      조회수
                      <Badge bg="light">
                        {sortField === "recView" && (sortDirection === "desc" ? "▼" : "▲")}
                      </Badge>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mostLike && (
                    <tr>
                      <td style={{ color: "red" }}> HOT! </td>
                      <td>
                        {" "}
                        <Link to={`./detail/${mostLike.rec_pk_num}`}>
                          {" "}
                          {mostLike.rec_title}[{mostLike.reply}]
                        </Link>{" "}
                      </td>
                      <td>
                        {" "}
                        {moment(mostLike.rec_regdate).format("YYYY-MM-DD")}{" "}
                      </td>
                      <td> {mostLike.rec_likes} </td>
                      <td> {mostLike.rec_view} </td>
                    </tr>
                  )}
                  {datas.content.length> 0 ? (
                    datas.content.map((data, index) =>
                      data.rec_pk_num !== mostLike.rec_pk_num ? (
                        <tr key={index}>
                          <td> {data.rec_pk_num} </td>
                          <td>
                            {" "}
                            <Link to={`./detail/${data.rec_pk_num}`}>
                              {" "}
                              {data.rec_title} [{data.reply}]
                            </Link>{" "}
                          </td>
                          <td>
                            {" "}
                            {moment(data.rec_regdate).format("YYYY-MM-DD")}{" "}
                          </td>
                          <td> {data.rec_likes} </td>
                          <td> {data.rec_view} </td>
                        </tr>
                      ) : (
                        <></>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="5">작성된 건의사항이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              )}
              <button
                className="btn btn-primary"
                onClick={() => navigate(`./create`)}
              >
                건의사항 등록
              </button>
              <Pagination className="justify-content-center">
            <Pagination.Item
            
              onClick={() => handlePageChange(currentPage)}
              disabled={currentPage === 0}
            > {'<<'} </Pagination.Item>
            {[...Array(datas.totalPages)].map((num, index) => (
              <Pagination.Item
                key={index}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Item
              onClick={() => handlePageChange(currentPage + 2)}
              disabled={currentPage === datas.totalPages - 1}
            > {'>>'} </Pagination.Item>
          </Pagination>
          
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default RecList;
