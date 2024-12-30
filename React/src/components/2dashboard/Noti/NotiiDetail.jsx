import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import NotiToast, { showToast } from "../../../variables/Toast/NotiToast";
import axiosInstance from "../../../api/axiosInstance";

const NotiDetail = () => {
  const location = useLocation();
  const { notiPkNum } = useParams();
  const navigate = useNavigate();
  //const compPkNum = 1; //임시 테스트 회사 번호
  //const loginUser = useSelector((state) => state.userData); // Redux에서 로그인한 유저 정보 가져오기
  const [noti, setNoti] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 확인/취소용 modal창 열림 닫힘 상태 관리
  
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
    
  const userInfo = JSON.parse(userInfoFromRoot);
  const compPkNum = userInfo.user_fk_comp_num; //sessionStorage에서 로그인 된 회사번호 받아오기
  const loginUser = userInfo.user_pk_num; //sessionStorage에서 로그인 유저 받아오기


  useEffect(() => {
    const fetchNoti = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/main/${compPkNum}/notice/${notiPkNum}`
        );
        setNoti(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoti();
  }, [notiPkNum]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const moveUpdate = () => {
    if (noti.noti_fk_user_num !== loginUser) {
      showToast.fail(); //작성자 불일치 토스트 창
      setTimeout(() => {
        navigate(`/main/noti/notidetail/${notiPkNum}`);
      }, 2000);
      return;
    }
    navigate(`/main/noti/notiedit/${notiPkNum}`);
  };

  const handleDelete = async () => {
    // 작성자 검증
    if (noti.noti_fk_user_num !== loginUser) {
      setModalOpen(false);
      showToast.fail(); //작성자 불일치 토스트 창
      setTimeout(() => {
        navigate(`/main/noti/notidetail/${notiPkNum}`);
      }, 2000);
      return;
    }
    try {
      await axiosInstance.delete(
        `/conect/main/${compPkNum}/notice/delete/${notiPkNum}`
      );
      navigate("/main/noti/notilist", { state: { success: true } });
    } catch (err) {
      setError("삭제 실패: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Container fluid style={{ marginTop: "2em" }}>
        <Card style={{ height: "40em", overflowY: "auto" }}>
          <CardHeader>
            <h2>공지게시판 상세보기</h2>
          </CardHeader>
          <CardBody style={{ fontSize: "1.2rem", marginTop: "1em" }}>
            {noti ? (
              <table
                className="table"
                style={{ border: "1px solid lightgray" }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "10%" }}>제목</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                      }}
                    >
                      {noti.noti_import === 1 && (
                        <span style={{ marginRight: "0.5em" }}>
                          <i
                            className="bi bi-pin-angle-fill"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                      )}
                      <strong>{noti.noti_title}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>프로젝트 명</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                      }}
                    >
                      {noti.projName}
                    </td>
                  </tr>
                  <tr>
                    <td>작성자</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                      }}
                    >
                      {noti.userName}
                    </td>
                  </tr>
                  <tr>
                    <td>등록일</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                      }}
                    >
                      {noti.noti_regdate}
                    </td>
                  </tr>
                  <tr>
                    <td>수정일</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                      }}
                    >
                      {noti.noti_modedate}
                    </td>
                  </tr>
                  <tr>
                    <td>내용</td>
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "100px",
                        whiteSpace: "pre-wrap", // 줄바꿈 보존
                        wordBreak: "break-all", // 긴 텍스트 줄바꿈
                        minHeight: "200px", // 최소 높이 설정
                        verticalAlign: "top", // 내용 상단 정렬
                      }}
                    >
                      {noti.noti_content}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>게시글을 찾을 수 없습니다.</div>
            )}
            {/* 테이블과 버튼 사이에 조회수 표시 */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // 오른쪽 정렬
                marginTop: "10px",
                marginBottom: "10px",
                marginRight: "5px",
                fontSize: "0.8rem",
                color: "#666", // 회색톤의 글자색
              }}
            >
              조회수: {noti.noti_view}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button className="btn btn-primary" onClick={moveUpdate}>
                수정
              </button>
              <button className="btn btn-danger" onClick={openModal}>
                삭제
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/main/noti/notilist")}
              >
                목록
              </button>
            </div>
          </CardBody>
        </Card>
      </Container>
      {/*Modal 창*/}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="삭제 확인"
        message="해당 공지 글을 삭제하시겠습니까?"
      />
      <NotiToast />
    </>
  );
};

export default NotiDetail;
