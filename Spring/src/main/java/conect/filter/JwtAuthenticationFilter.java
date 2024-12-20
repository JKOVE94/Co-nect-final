package conect.filter;

import conect.data.util.JwtUtil;
import conect.security.UserSecurityService;
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
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserSecurityService userSecurityService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserSecurityService userSecurityService) {
        this.jwtUtil = jwtUtil;
        this.userSecurityService = userSecurityService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (jwtUtil.validateToken(token)) {
                    String userId = jwtUtil.getUserIdFromToken(token);

                    UserDetails userDetails = userSecurityService.loadUserByUsername(userId);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.debug("Authentication set for user: {}", userId);
                } else {
                    logger.warn("Invalid or expired JWT token");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid or expired JWT token");
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
}
