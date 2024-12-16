package conect.controller;

import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        try {
            boolean isValid = jwtUtil.validateToken(token);
            if (isValid) {
                String username = jwtUtil.getUsernameFromToken(token);
                return ResponseEntity.ok(Map.of(
                    "isValid", true,
                    "username", username
                ));
            }
        } catch (Exception e) {
            // 토큰 검증 중 발생하는 예외 처리
        }
        
        return ResponseEntity.ok(Map.of("isValid", false));
    }
}
