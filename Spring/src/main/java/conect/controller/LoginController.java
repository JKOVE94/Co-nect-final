package conect.controller;

import conect.data.dto.LoginDto;
import conect.data.form.LoginForm;
import conect.service.common.LoginService;
import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")

    public ResponseEntity<LoginDto> login(@RequestBody LoginForm form) {
        LoginDto loginDto = loginService.checkLogin(form);

        switch (loginDto.getStatus()) {
            case 1: // 로그인 성공
                return ResponseEntity.ok(loginDto);
            case 2: // 정보 불일치
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginDto);
            case 3: // 잠긴 계정
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(loginDto);
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(loginDto);
        }
    }
}
