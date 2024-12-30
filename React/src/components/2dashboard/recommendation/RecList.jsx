import axiosInstance from "api/axiosInstance";
import moment from "moment";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Table,
} from "react-bootstrap";

const RecList = ({ handleError, projPkNum }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [datas, setDatas] = useState([]); //건의사항 게시글
  const [mostLike, setMostLike] = useState({}); //최상단에 위치할 글 (좋아요 수가 가장 많은 글)

  const [sortField, setSortField] = useState("recRegdate"); //정렬컬럼 default:작성일자
  const [sortDirection, setSortDirection] = useState("desc"); //정렬기준(asc/desc) default : desc
  const [currentPage, setCurrentPage] = useState(0); //현재페이지번호

  const [loading, setLoading] = useState(true); //데이터 로딩 중 true, 로딩 완료 false

  const navigate = useNavigate();

  //게시글 목록 불러오기
  const getData = async () => {
    setLoading(true);
    axiosInstance
      .get(`/conect/${compNum}/rec/${projPkNum}`, {
        params: {
          sortField: sortField, //정렬컬럼
          sortDirection: sortDirection, //정렬기준
          size: 9, //한페이지에 보일 게시글 수
          page: currentPage, //현재 페이지 번호
        },
      })
      .then((res) => {
        setDatas(res.data); //게시글 목록 저장
        setLoading(false); //로딩완료
      })
      .catch((err) => {
        setLoading(false);
        handleError("건의사항 목록을 불러올 수 없습니다.", true);
      });
  };

  //최상단에 위치할 글 (좋아요 수가 가장 많은 글)
  const getMostLike = async () => {
    axiosInstance
      .get(`/conect/${compNum}/rec/${projPkNum}/mostlike`)
      .then((res) => setMostLike(res.data.content[0]))
      .catch((err) => handleError("추천 게시글을 불러올 수 없습니다.", true));
  };

  //페이지 변경
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };

  //정렬
  const handleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("desc");
    } else {
      sortDirection === "asc"
        ? setSortDirection("desc")
        : setSortDirection("asc");
    }
  };

  useEffect(() => {
    getMostLike();
    getData();
  }, [sortField, sortDirection, currentPage, projPkNum]);

  

  return (
    <>
      <Card>
        <CardHeader
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2>건의사항 게시판</h2>
        </CardHeader>
        <CardBody style={{ height: "40em", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center" }}>로딩 중 ...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("recRegdate")}
                  >
                    작성일
                    <Badge bg="light">
                      {sortField === "recRegdate" &&
                        (sortDirection === "desc" ? "▼" : "▲")}
                    </Badge>
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("recLikes")}
                  >
                    좋아요수
                    <Badge bg="light">
                      {sortField === "recLikes" &&
                        (sortDirection === "desc" ? "▼" : "▲")}
                    </Badge>
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("recView")}
                  >
                    조회수
                    <Badge bg="light">
                      {sortField === "recView" &&
                        (sortDirection === "desc" ? "▼" : "▲")}
                    </Badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                { mostLike && mostLike.rec_pk_num ? (
                  <tr>
                    <td style={{ color: "red" }}> HOT! </td>
                    <td>
                      <Link to={`./detail/${mostLike.rec_pk_num}`}>
                        {mostLike.rec_title}[{mostLike.reply}]
                      </Link>
                    </td>
                    <td>{moment(mostLike.rec_regdate).format("YYYY-MM-DD")}</td>
                    <td> {mostLike.rec_likes} </td>
                    <td> {mostLike.rec_view} </td>
                  </tr>
                ):<></>}
                {datas && datas.content && datas.content.length > 0 ? (
                  datas.content.map((data, index) =>
                    data.rec_pk_num !== mostLike.rec_pk_num ? (
                      <tr key={index}>
                        <td> {data.rec_pk_num} </td>
                        <td>
                          <Link
                            to={{
                              pathname: `./detail/${data.rec_pk_num}`,
                              state: { data: data },
                            }}
                          >
                            {data.rec_title} [{data.reply}]
                          </Link>
                        </td>
                        <td>{moment(data.rec_regdate).format("YYYY-MM-DD")}</td>
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
            </Table>
          )}
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`./create`)}
            >
              건의사항 등록
            </button>
          </div>
          {/* 페이징 */}
          <div>
            <Pagination className="justify-content-center">
              <button
                className={`btn btn-link`}
                onClick={() => handlePageChange(currentPage)}
                disabled={currentPage === 0}
              >
                &laquo; 이전
              </button>
              {[...Array(datas.totalPages)].map((num, index) => (
                <button
                  className={`btn btn-link`}
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`btn btn-link`}
                onClick={() => handlePageChange(currentPage + 2)}
                disabled={currentPage === datas.totalPages - 1}
              >
                다음 &raquo;
              </button>
            </Pagination>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
export default RecList;