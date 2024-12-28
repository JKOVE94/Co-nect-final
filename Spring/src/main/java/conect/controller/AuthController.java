package conect.controller;

import conect.data.util.JwtUtil;
import conect.service.common.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final JwtUtil jwtUtil;
    private final LoginService loginService;

    @Autowired
    public AuthController(JwtUtil jwtUtil, LoginService loginService) {
        this.jwtUtil = jwtUtil;
        this.loginService = loginService;
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        boolean isValid = loginService.validateAccessToken(token);
        if (isValid) {
            String userId = jwtUtil.getUserIdFromToken(token);
            logger.info("토큰 검증 성공: 사용자 ID - {}", userId);
            return ResponseEntity.ok(Map.of("isValid", true, "userId", userId));
        }
        
        return ResponseEntity.ok(Map.of("isValid", false));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                          HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token is missing"));
        }
        
        try {
            String newAccessToken = loginService.refreshAccessToken(refreshToken);
            String userId = loginService.getUserIdFromRefreshToken(refreshToken);
            logger.info("토큰 갱신 성공: 사용자 ID - {}", userId);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid refresh token: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid refresh token"));
        }
    }
}
