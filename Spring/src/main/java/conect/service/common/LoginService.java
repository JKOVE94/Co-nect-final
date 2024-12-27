package conect.service.common;

import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.form.LoginForm;

public interface LoginService {
    LoginDto checkLogin(LoginForm form);
    int getTryNum(String userId);
    UserDto getUserInfo(String userId);
    
    // JWT 관련 메서드
    String generateToken(UserDto userDto);
    boolean validateToken(String token);
    UserDto getUserFromToken(String token);
}
