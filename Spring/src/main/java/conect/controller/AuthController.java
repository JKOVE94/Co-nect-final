package conect.controller;

import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/validate-token")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || token.isEmpty()) {
            logger.warn("토큰이 제공되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "isValid", false,
                "message", "토큰이 제공되지 않았습니다."
            ));
        }

        try {
            boolean isValid = jwtUtil.validateToken(token);
            if (isValid) {
                String userId = jwtUtil.getUserIdFromToken(token);
                logger.info("토큰 검증 성공: 사용자 ID - {}", userId);
                return ResponseEntity.ok(Map.of(
                    "isValid", true,
                    "userId", userId
                ));
            }
        } catch (Exception e) {
            logger.error("토큰 검증 중 오류 발생: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "isValid", false,
            "message", "유효하지 않은 토큰입니다."
        ));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        try {
            if (jwtUtil.isTokenExpired(token)) { 
                String userId = jwtUtil.getUserIdFromToken(token);
                String newToken = jwtUtil.generateToken(userId);
                logger.info("토큰 갱신 성공: 사용자 ID - {}", userId);
                return ResponseEntity.ok(Map.of("token", newToken));
            } else if (jwtUtil.validateToken(token)) { 
                String userId = jwtUtil.getUserIdFromToken(token);
                String newToken = jwtUtil.generateToken(userId);
                logger.info("토큰 갱신 성공: 사용자 ID - {}", userId);
                return ResponseEntity.ok(Map.of("token", newToken));
            }
        } catch (Exception e) {
            logger.error("토큰 갱신 중 오류 발생: {}", e.getMessage());
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "message", "토큰 갱신에 실패했습니다."
        ));
    }
}
