import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, CardBody } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import arrowBlack from "assets/img/ect/arrow_black.png";
import axiosInstance from "api/axiosInstance";

const ProjAddMember = (props) => {
  const nav = useNavigate();

  const { projName } = useParams();
  const { projPkNum } = useParams();
  //원본 데이터  전체 사원
  const [allUser, setAllUser] = useState([]);
  //원본 데이터  프로젝트 참여 사원 => 값이 수정될때만 변경
  const [projmem, setProjmem] = useState([]);
  //원본 데이터 전체 사원에서 프로젝트 참여 사원 제거 => 값이 수정될때만 변경
  const [filteredUsers, setFilteredUsers] = useState([]);

  //검색된 데이터 전체 사원 - 화면에 표시되는 값
  const [searchedUser, setSearchedUser] = useState([]);
  //검색된 데이터 프로젝트 참여 사원 - 화면에 표시되는 값
  const [searchedProjmem, setSearchedProjmem] = useState([]);

  //체크된 전체 사원
  const [checked, setChecked] = useState([]);
  //체크된 프로젝트 참여 사원
  const [projmemChecked, setProjmemChecked] = useState([]);

  //전송용 사번데이터
  const [fetchMemberNum, setFetchMemberNum] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await handleAllUserFetch();
      await handleMemberFetch();
    };

    fetchData();

    return () => {
      // 정리(cleanup) 함수
    };
  }, [projPkNum]);

  useEffect(() => {
    const filtered = removeDuplicate(allUser, projmem);
    setFilteredUsers(filtered);
    setSearchedUser(filtered);
    setSearchedProjmem(projmem);
  }, [allUser, projmem]);

  useEffect(() => {
    handleFetchMemberNum();
  }, [projmem]);

  const handleAllUserFetch = async () => {
    try {
      const response = await axiosInstance.get(
        `/conect/${props.compNum}/manage/user`
      );
      setAllUser(response.data);
      // console.log("All user:", response.data);
    } catch (error) {
      console.error("Error fetching proj:", error);
    }
  };

  const handleMemberFetch = async () => {
    try {
      const response = await axiosInstance.get(
        `/conect/${props.compNum}/manage/projmem/${projPkNum}`
      );
      setProjmem(response.data);
      // console.log("projmem:", response.data);
    } catch (error) {
      console.error("Error fetching proj:", error);
    }
  };

  const handleUpdateMember = async () => {
    try {
      const response = await axiosInstance.put(
        `/conect/${props.compNum}/manage/projmem`,
        {
          projmem_fk_proj_num: projPkNum,
          projmem_fk_user_num: fetchMemberNum,
        }
      );
      nav(`/manage/proj/detail/${projPkNum}`);

      // console.log("projmem update:", response.data);
    } catch (error) {
      console.error("Error fetching proj:", error);
    }
  };

  const removeDuplicate = (alluser, member) => {
    const memberUserNums = member.map((mem) => mem.projmem_fk_user_num);
    return alluser.filter((item) => !memberUserNums.includes(item.user_pk_num));
  };

  const handleClick = (usernum) => {
    if (checked.includes(usernum)) {
      setChecked(checked.filter((num) => num !== usernum));
    } else {
      setChecked([...checked, usernum]);
    }
    // console.log(checked);
  };

  const handleMemClick = (usernum) => {
    if (projmemChecked.includes(usernum)) {
      setProjmemChecked(projmemChecked.filter((num) => num !== usernum));
    } else {
      setProjmemChecked([...projmemChecked, usernum]);
    }
    // console.log(projmemChecked);
  };

  //-------- 검색 기능 ------------
  const searchUser = (e) => {
    const searchValue = e.target.value;
    // console.log(searchValue);
    const filtered = filteredUsers.filter((user) =>
      user.user_name.includes(searchValue)
    );
    setSearchedUser(filtered);
  };

  const searchMember = (e) => {
    const searchValue = e.target.value;
    const filtered = projmem.filter((mem) =>
      mem.projmem_name.toLowerCase().includes(searchValue)
    );
    setSearchedProjmem(filtered);
  };

  //-------- 선택, 이동 ------------
  const handleMoveRight = () => {
    // checked 배열의 값들을 객체로 변환하여 projmem 배열에 추가
    const selectedUsers = checked.map((userPkNum) => {
      const user = allUser.find((user) => user.user_pk_num === userPkNum);
      return {
        projmem_fk_proj_num: Number.parseInt(projPkNum),
        projmem_fk_user_num: userPkNum,
        projmem_name: user.user_name, // user_name을 projmem_name에 추가
      };
    });

    setFilteredUsers(
      filteredUsers.filter((user) => !checked.includes(user.user_pk_num))
    );
    setProjmem([...projmem, ...selectedUsers]);
    setChecked([]);
  };

  const handleMoveLeft = () => {
    setProjmem(
      projmem.filter((mem) => !projmemChecked.includes(mem.projmem_fk_user_num))
    );
    setFilteredUsers([...filteredUsers, ...projmemChecked]);
    setProjmemChecked([]);
  };

  const handleFetchMemberNum = () => {
    const fetchMemberNum = projmem.map((mem) => mem.projmem_fk_user_num);
    setFetchMemberNum(fetchMemberNum);
  };

  //GCS에 이미지가 없을 때 처리
  const handleImageError = (event) => {
    event.target.style.display = "none"; // 이미지가 로드되지 않았을 때 숨기기
  };

  const handleCancle = () => {
    nav(-1);
  };

  return (
    <>
      <Container fluid style={{ marginTop: "2em" }}>
        <Card>
          <CardHeader>
            <h2>프로젝트 팀원 설정 ({projName})</h2>
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleUpdateMember}
              >
                저장
              </button>
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={handleCancle}
              >
                취소
              </button>
            </div>
          </CardHeader>
          <CardBody>
            <div class="container">
              <div class="content">
                <div class="section">
                  <h2>전체 사원</h2>
                  <div class="search-box">
                    <input
                      type="text"
                      placeholder="사원 검색"
                      onKeyUp={(event) => searchUser(event)}
                    />
                  </div>
                  <ul class="employee-list">
                    {searchedUser.map((user) => (
                      <li
                        className={`employee ${
                          checked.includes(user.user_pk_num) ? "checked" : ""
                        }`}
                        onClick={() => handleClick(user.user_pk_num)}
                        key={user.user_pk_num}
                        data-user-num={user.user_pk_num}
                      >
                        <div class="profile">
                          <img
                            src={`https://storage.cloud.google.com/co-nect/emp_pic/${props.compNum}_${user.user_pk_num}`}
                            className="profile-image"
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                        &nbsp;&nbsp;
                        <div class="info">
                          <div class="name">{user.user_name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div class="buttons">
                  <button
                    class="arrow-button-right btn btn-secondary"
                    onClick={() => handleMoveRight()}
                  >
                    &gt;
                  </button>
                  <button
                    class="arrow-button-left btn btn-secondary"
                    onClick={() => handleMoveLeft()}
                  >
                    &lt;
                  </button>
                </div>
                <div class="section">
                  <h2>프로젝트 참여 사원</h2>
                  <div class="search-box">
                    <input
                      type="text"
                      placeholder="사원 검색"
                      onKeyUp={(event) => searchMember(event)}
                    />
                  </div>
                  <ul class="employee-list selected-employees">
                    {searchedProjmem.map((mem) => (
                      <li
                        className={`employee ${
                          projmemChecked.includes(mem.projmem_fk_user_num)
                            ? "checked"
                            : ""
                        }`}
                        key={mem.projmem_fk_user_num}
                        data-user-num={mem.projmem_fk_user_num}
                        onClick={() => handleMemClick(mem.projmem_fk_user_num)}
                      >
                        <div class="profile">
                          <img
                            src={`https://storage.cloud.google.com/co-nect/emp_pic/${props.compNum}_${mem.projmem_fk_user_num}`}
                            className="profile-image"
                            onError={handleImageError}
                          />
                        </div>
                        <div class="info">
                          <span class="name">{mem.projmem_name}</span>
                        </div>
                        <button class="remove"></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ProjAddMember;
