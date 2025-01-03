package conect.controller;

import conect.data.dto.LoginDto;
import conect.data.form.LoginForm;
import conect.service.common.LoginService;
import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginDto> login(@RequestBody LoginForm form) {
        LoginDto loginDto = loginService.checkLogin(form);
        System.out.println(loginDto.getStatus());
        switch (loginDto.getStatus()) {
            case 1: // 로그인 성공
            System.out.println("-----------------login1  -----------------");
                String accessToken = loginDto.getAccessToken();
                String refreshToken = loginDto.getRefreshToken();
                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(14 * 24 * 60 * 60) // 14일
                        .build();

                ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(1 * 60 * 60) // 1시간
                        .build();

                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                        .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                        .body(loginDto);
            case 2: // 정보 불일치
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginDto);

            case 3: // 잠긴 계정
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(loginDto);
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(loginDto);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken != null) {
            String userId = loginService.getUserIdFromRefreshToken(refreshToken);
            loginService.logout(userId);
        }

        ResponseCookie deleteRefreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie.toString())
                .body("로그아웃 성공");
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        System.out.println("-----------------validateToken-----------------");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("유효한 토큰이 제공되지 않았습니다.");
        }

        token = token.substring(7);

        if (loginService.validateAccessToken(token)) {
            String userId = jwtUtil.getUserIdFromToken(token);
            return ResponseEntity.ok(Map.of("isValid", true, "userId", userId));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("isValid", false, "message", "유효하지 않은 토큰입니다."));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 제공되지 않았습니다.");
        }
        try {
            System.out.println("-----------------refresh-token-----------------");
            Map<String, String> tokens = loginService.refreshTokens(refreshToken);
            String newAccessToken = tokens.get("accessToken");
            String newRefreshToken = tokens.get("refreshToken");

            ResponseCookie newRefreshTokenCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(14 * 24 * 60 * 60) // 14일
                    .build();
            
            ResponseCookie newaccessTokenCookie = ResponseCookie.from("accessToken", newAccessToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(1 * 60 * 60) // 1시간
                    .build();


            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newRefreshTokenCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, newaccessTokenCookie.toString())
                    .body(Map.of("accessToken", newAccessToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 리프레시 토큰입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("토큰 갱신 중 오류가 발생했습니다.");
        }
    }

}
