package conect.service.common;

import conect.data.dto.DepartmentDto;
import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.form.LoginForm;

import java.util.List;

public interface LoginService {
    LoginDto checkLogin(LoginForm form);
    int getTryNum(int user_pk_num);
    UserDto getUserInfo(int user_pk_num);
    List<DepartmentDto> getDeparts();
    
    // JWT 관련 메서드 추가
    String generateToken(UserDto userDto);
    boolean validateToken(String token);
    UserDto getUserFromToken(String token);
}
