import React, { useState, useEffect } from "react";
import "assets/landing/css/login.css";
import ConectTextLogo from "assets/img/logo/ConectTextLogo";
import { useNavigate } from "react-router-dom";
import LoginToast from "variables/Toast/LoginToast";
import { useDispatch } from "react-redux";
import { LOGIN } from "../Redux/Reducer/userDataReducer";
import LoginModal from "../variables/Modal/LoginModal";
import axios from "axios";
import {setAuthToken} from "api/axiosInstance";
import { LOGOUT } from "../Redux/Reducer/userDataReducer";

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFirst, setIsFirst] = useState(true);
  const [isSignIn, setIsSignIn] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    comp_pk_num: "",
    user_id: "",
    user_pw: "",
    user_pk_num: "",
  });
  const [errType, setErrType] = useState(0);
  const [data, setData] = useState({});
  const [isReversed, setIsReversed] = useState(false);

  const [showA, setShowA] = useState(false);
  const [showM, setShowM] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => {
    setIsSignIn((prev) => !prev);
  };

  useEffect(() => {
    sessionStorage.removeItem("persist:proj_pk_num");
    dispatch(LOGOUT());
    sessionStorage.removeItem("token");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },[])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirst(false);
      setIsSignIn(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showA) {
      const timer = setTimeout(() => {
        setShowA(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showA]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowA = () => {
    setShowA(true);
  };

  const handleShowM = () => setShowM(true);
  const handleCloseM = () => setShowM(false);

  const validateInputs = () => {
    if (!loginInfo.comp_pk_num || !loginInfo.user_id || !loginInfo.user_pw) {
      setErrType(5);
      toggleShowA();
      return false;
    }
    return true;
  };

  const login = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("/conect/login", loginInfo);
      const responseData = res.data;
      setData(responseData);
      switch (responseData.status) {
        case 1: // 로그인 성공
        dispatch(
          LOGIN({
            user_pk_num: responseData.user_pk_num,
            user_id: responseData.user_id,
            user_name: responseData.user_name,
            user_mail: responseData.user_mail,
            user_pic: responseData.user_pic,
            user_fk_comp_num: responseData.user_fk_comp_num,
            user_author: responseData.user_author,
          })
        );
        setIsReversed(true);
        setAuthToken(responseData.accessToken);
        setTimeout(() => {
            navigate(`/ProjSel/${responseData.user_pk_num}`);
          }, 1000);
          break;
        case 2: // 정보 불일치
          setErrType(2);
          toggleShowA();
          break;
        case 3: // 잠긴 계정
          setErrType(3);
          handleShowM();
          break;
        default:
          setErrType(4);
          toggleShowA();
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      if (error.response && error.response.status === 401) {
        setData(error.response.data);
        if(data.status === 2){
         setErrType(2);
        toggleShowA();
        }
        else if(data.status === 3){
          setErrType(3);
          handleShowM();
        }

      }
      else if (error.response && error.response.status === 403) {
        // 403 Forbidden 에러 처리 (잠긴 계정)
        setErrType(3);
        handleShowM();
      } else {
        setErrType(4);
        toggleShowA();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`login-container ${
          isFirst ? "" : isSignIn ? "sign-in" : "sign-up"
        } ${isReversed ? "reverse" : ""}`}
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
                      min={1}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <i className="bx bxs-user"></i>
                    <input
                      type="text"
                      placeholder="아이디"
                      name="user_id"
                      value={loginInfo.user_id}
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
                  </div>
                  <button type="submit" className="button" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "로그인"}
                  </button>
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
      {showA && (
        <LoginToast
          showA={showA}
          toggleShowA={toggleShowA}
          type={errType}
          data={data}
        />
      )}
      <LoginModal
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={errType}
      />
    </>
  );
};

export default Login;