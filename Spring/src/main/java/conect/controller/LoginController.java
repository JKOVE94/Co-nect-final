package conect.controller;

import conect.data.dto.LoginDto;
import conect.data.form.LoginForm;
import conect.service.common.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public Object Login(@RequestBody LoginForm form){
        int isLogin = loginService.checkLogin(form);
       /*
        로그인 상태를 숫자로 정의
        1 : 로그인 성공
        2 : 정보 불일치
        3 : 잠긴 계정
     */
        if(isLogin==1){
            LoginDto dto = new LoginDto();
            dto.setStatus(1);
            return form;
        }
        else if(isLogin==2){
            LoginDto dto = new LoginDto(); //정보 초기화
            dto.setStatus(2); //로그인 상태 담기
            dto.setUser_trynum(loginService.getTryNum(form.getUser_pk_num())); //로그인 시도횟수 담기
            return dto;
        }
        else {
            LoginDto dto = new LoginDto(); //정보 초기화
            dto.setStatus(3); //로그인 상태 담기
            dto.setUser_trynum(loginService.getTryNum(form.getUser_pk_num())); //로그인 시도횟수 담기
            return dto;
        }
    }
}
