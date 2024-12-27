package conect.filter;

import conect.data.util.JwtUtil;
import conect.security.UserSecurityService;
import conect.service.common.LoginService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserSecurityService userSecurityService;
    private final LoginService loginService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserSecurityService userSecurityService, LoginService loginService) {
        this.jwtUtil = jwtUtil;
        this.userSecurityService = userSecurityService;
        this.loginService = loginService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String accessToken = extractAccessToken(request);
            String refreshToken = extractRefreshToken(request);

            if (accessToken != null) {
                if (loginService.validateAccessToken(accessToken)) {
                    processToken(accessToken);
                } else if (refreshToken != null && loginService.validateRefreshToken(refreshToken)) {
                    String newAccessToken = loginService.refreshAccessToken(refreshToken);
                    response.setHeader("Authorization", "Bearer " + newAccessToken);
                    processToken(newAccessToken);
                } else {
                    logger.warn("Invalid or expired JWT tokens");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid or expired JWT tokens");
                    return;
                }
            } else {
                logger.debug("No JWT token found in request");
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Internal server error while processing authentication");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void processToken(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        UserDetails userDetails = userSecurityService.loadUserByUsername(userId);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.debug("Authentication set for user: {}", userId);
    }
}
