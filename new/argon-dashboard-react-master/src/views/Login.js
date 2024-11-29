/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState, useEffect } from "react";
import "assets/landing/css/login.css";
import ConectTextLogo from "assets/img/logo/ConectTextLogo";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//이 컴포넌트는 메인 페이지를 세팅하는 컴포넌트입니다.

const Login = (props) => {
  const [isFirst, setIsFirst] = useState(true);
  const [isSignIn, setIsSignIn] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    comp_pk_num: "",
    user_pk_num: "",
    user_pw: "",
  });
  const navigate = useNavigate();

  const toggle = () => {
    setIsSignIn((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirst(false);
      setIsSignIn(true);
    }, 200);

    // 클린업 함수: 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []); // 빈 배열로 수정

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      /*
      res에 담기는 정보
      comp_pk_num; //회사번호
      user_pk_num; //사번
      status; //로그인 상태 번호로 표시 1 성공, 2 : 정보 불일치, 3 : 잠긴 계정
      user_trynum; //유저가 로그인 시도 횟수
      */
      const res = await axios.post("/login", loginInfo);
      console.log(res);
      if (res.data.status === 1) {
        navigate("/main");
      } else if (res.data.status === 2) {
        //정보 불일치 => toast로 실패 알림 / 로그인 시도횟수 안내
      } else if (res.data.status === 3) {
        //잠긴계정 => modal로 잠긴계정 안내
      }
    } catch (error) {
      //로그인 실패에 대한 정보도 상태정보에 담겨있기 때문에 해당 에러는 서버와의 연결문제
      console.error("로그인 실패:", error);
    }
  };

  return (
    <>
      <div
        className={`login-container ${
          isFirst ? "" : isSignIn ? "sign-in" : "sign-up"
        }`}
      >
        <div className="row">
          <div className="col align-items-center flex-col sign-up">
            <h2>비밀번호를 잊으셨나요?</h2>
            <div className="form-wrapper align-items-center">
              <div className="form sign-up">
                <p>
                  <button className="button">관리자에게 연락하기</button>
                  <b onClick={() => toggle()} className="pointer">
                    로그인하기
                  </b>
                </p>
              </div>
            </div>
          </div>
          <div className="col align-items-center flex-col sign-in">
            <ConectTextLogo />
            {/* <h3 style={{ color: "#255260" }}>어서오세요. 코난2조 입니다.</h3> */}
            <form onSubmit={(e) => login(e)}>
              <div className="form-wrapper align-items-center">
                <div className="form sign-in">
                  <div className="input-group">
                    <i className="bx bxs-com-num"></i>
                    <input
                      type="number"
                      placeholder="회사번호"
                      name="comp_pk_num"
                      value={loginInfo.comp_pk_num}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-user"></i>
                    <input
                      type="number"
                      placeholder="사번"
                      name="user_pk_num"
                      value={loginInfo.user_pk_num}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-lock-alt"></i>
                    <input
                      type="password"
                      placeholder="비밀번호"
                      name="user_pw"
                      value={loginInfo.user_pw}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <button type="submit" className="button">
                      로그인
                    </button>
                  </div>
                  <p>
                    <b onClick={() => toggle()} className="pointer">
                      비밀번호를 잊으셨나요?
                    </b>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="form-wrapper"></div>
        <div className="row content-row">
          <div className="col align-items-center flex-col">
            <div className="text sign-in">
              <h2>Welcome</h2>
            </div>

            <div className="img sign-in"></div>
          </div>
          <div className="col align-items-center flex-col">
            <div className="text sign-up">
              <h2>&emsp; Contact</h2>
            </div>
          </div>
        </div>
      </div>

      <script src="./asset/1_landing/login.js"></script>
    </>
  );
};

export default Login;
