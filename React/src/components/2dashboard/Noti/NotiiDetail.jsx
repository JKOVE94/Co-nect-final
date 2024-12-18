import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import NotiToast from "variables/Toast/NotiToast";

const NotiDetail = () => {
  const location = useLocation();
  const { notiPkNum } = useParams();
  const navigate = useNavigate();
  const compPkNum =1;//임시 테스트 회사 번호

  const [type, setType] = useState(0);
  const [noti, setNoti] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const actionType = location.state?.actionType;
    if (actionType === "create") {
      setType("create");
      toggleToast();
    } else if (actionType === "update") {
      setType("update");
      toggleToast();
    }

    const fetchNoti = async () => {
      try {
        const response = await axios.get(`/main/${compPkNum}/notice/${notiPkNum}`);
        setNoti(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoti();
  }, [notiPkNum, location.state]);

  const toggleToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/main/${compPkNum}/notice/delete/${notiPkNum}`);
      navigate("/main/noti/notilist", { state: { success: true } });
    } catch (err) {
      setError("삭제 실패: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card style={{ height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>공지게시판 상세보기</h2>
        </CardHeader>
        <CardBody style={{ fontSize: "1.2rem", marginTop: "1em" }}>
          {noti ? (
            <table className="table" style={{ border: "1px solid lightgray" }}>
              <tbody>
                <tr>
                  <td style={{ width: "10%" }}>제목</td>
                  <td>
                    {noti.noti_isnotice && (
                      <span role="img" aria-label="bell">
                        🔔&nbsp;
                      </span>
                    )}
                    <strong>{noti.noti_title}</strong>
                  </td>
                </tr>
                <tr>
                  <td>프로젝트 명</td>
                  <td>{noti.projName}</td>
                </tr>
                <tr>
                  <td>작성자</td>
                  <td>{noti.userName}</td>
                </tr>
                <tr>
                  <td>등록일</td>
                  <td>{noti.noti_regdate}</td>
                </tr>
                <tr>
                  <td>수정일</td>
                  <td>{noti.noti_modedate}</td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td>{noti.noti_content}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div>게시글을 찾을 수 없습니다.</div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button className="btn btn-primary" onClick={() => navigate(`/noti/edit/${notiPkNum}`)}>
              수정
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              삭제
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/main/noti/notilist")}> 
              목록
            </button>
          </div>
        </CardBody>
      </Card>
      <NotiToast type={type} show={showToast} />
    </Container>
  );
};

export default NotiDetail;
