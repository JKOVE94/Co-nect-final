package conect.controller;

import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.form.LoginForm;
import conect.service.common.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public Object Login(@RequestBody LoginForm form) {
        int isLogin = loginService.checkLogin(form);
        /*
         * 로그인 상태를 숫자로 정의
         * 1 : 로그인 성공
         * 2 : 정보 불일치
         * 3 : 잠긴 계정
         */
        if (isLogin == 1) {
            LoginDto userInfoDto = new LoginDto();
            UserDto dto = loginService.getUserInfo(form.getUser_pk_num());
            userInfoDto.setStatus(1); // 로그인 상태 담기
            userInfoDto.setUser_pk_num(dto.getUser_pk_num()); // 사번 담기
            userInfoDto.setUser_id(dto.getUser_id()); // 아이디 담기
            userInfoDto.setUser_name(dto.getUser_name()); // 이름 담기
            userInfoDto.setUser_mail(dto.getUser_mail()); // 이메일 담기
            userInfoDto.setUser_pic(dto.getUser_pic()); // 사진 담기
            userInfoDto.setUser_lastlogin(dto.getUser_lastlogin()); // 마지막 로그인 일시 담기
            userInfoDto.setUser_author(dto.getUser_author()); // 권한 담기
            userInfoDto.setUser_istemppw(dto.isUser_istemppw()); // 임시 비밀번호 여부 담기
            userInfoDto.setUser_fk_comp_num(dto.getUser_fk_comp_num()); // 회사 번호 담기
            return userInfoDto;
        } else if (isLogin == 2) {
            LoginDto userInfoDto = new LoginDto(); // 정보 초기화
            userInfoDto.setStatus(2); // 로그인 상태 담기
            userInfoDto.setUser_trynum(loginService.getTryNum(form.getUser_pk_num())); // 로그인 시도횟수 담기
            return userInfoDto;
        } else {
            LoginDto userInfoDto = new LoginDto(); // 정보 초기화
            userInfoDto.setStatus(3); // 로그인 상태 담기
            userInfoDto.setUser_trynum(loginService.getTryNum(form.getUser_pk_num())); // 로그인 시도횟수 담기
            return userInfoDto;
        }
    }
}
