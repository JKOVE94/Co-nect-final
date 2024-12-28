package conect.data.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final SecretKey key;
    private final long accessTokenExpirationTime;
    private final long refreshTokenExpirationTime;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access-token-expiration-time}") long accessTokenExpirationTime,
                   @Value("${jwt.refresh-token-expiration-time}") long refreshTokenExpirationTime) {
        try {
            this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("JWT Secret Key가 올바르지 않습니다. Base64로 인코딩된 문자열이어야 합니다.", e);
        }
        this.accessTokenExpirationTime = accessTokenExpirationTime;
        this.refreshTokenExpirationTime = refreshTokenExpirationTime;
    }

    public String generateAccessToken(String userId) {
        return generateToken(userId, accessTokenExpirationTime);
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    private String generateToken(String userId, long expirationTime) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token);
    }

    private boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.warn("토큰이 만료되었습니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("지원되지 않는 토큰입니다: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("잘못된 형식의 토큰입니다: {}", e.getMessage());
        } catch (SecurityException e) {
            logger.error("토큰의 서명이 유효하지 않습니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("토큰이 비어있거나 잘못되었습니다: {}", e.getMessage());
        }
        return false;
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            logger.warn("JWT 토큰이 만료되었습니다.");
            throw new IllegalArgumentException("만료된 토큰입니다.");
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
}
