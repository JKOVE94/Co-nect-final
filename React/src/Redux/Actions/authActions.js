// authActions.js
import axiosInstance from "../../api/axiosInstance";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const REFRESH_TOKEN = "REFRESH_TOKEN";

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

export const refreshToken = (userData) => ({
  type: REFRESH_TOKEN,
  payload: userData,
});

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    const loginDto = response.data;
    if (loginDto.status === 1) {
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + loginDto.accessToken;
      dispatch(loginSuccess(loginDto));
      return { success: true, user_pk_num: loginDto.user_pk_num };
    } else {
      return { success: false, status: loginDto.status };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      error: error.response?.data?.message || "로그인에 실패했습니다.",
    };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axiosInstance.post("/logout");
    delete axiosInstance.defaults.headers.common["Authorization"];
    dispatch(logout());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const refreshTokenAndGetUser = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/refresh-token");
    if (data && data.accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + data.accessToken;
      dispatch(refreshToken(data));
      return data;
    }
    throw new Error("Access token not found in refresh token response");
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};
