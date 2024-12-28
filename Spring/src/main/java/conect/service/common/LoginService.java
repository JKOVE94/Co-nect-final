package conect.service.common;

import java.util.Map;

import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.form.LoginForm;
import jakarta.servlet.http.HttpServletRequest;

public interface LoginService {
    LoginDto  checkLogin(LoginForm form);

    UserDto getUserInfo(String userId);

    int getTryNum(String userId);

    String generateAccessToken(UserDto userDto);

    String generateRefreshToken(UserDto userDto);

    boolean validateAccessToken(String token);

    boolean validateRefreshToken(String refreshToken);

    UserDto getUserFromToken(String token);

    String refreshAccessToken(String refreshToken);

    void logout(String userId);

    String getUserIdFromRefreshToken(String refreshToken);

    String extractAccessToken(HttpServletRequest request);

    String extractRefreshToken(HttpServletRequest request);

    Map<String, String> refreshTokens(String refreshToken);

}
