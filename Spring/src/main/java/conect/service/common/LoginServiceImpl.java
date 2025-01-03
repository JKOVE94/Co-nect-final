package conect.service.common;

import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.LoginForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.UserRepository;
import conect.data.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {
    private static final Logger logger = LoggerFactory.getLogger(LoginServiceImpl.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginServiceImpl(UserRepository userRepository, CompanyRepository companyRepository, JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserInfo(String userId) {
        return UserDto.fromEntity(userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public int getTryNum(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUserTrynum();
    }

    @Override
    @Transactional
    public LoginDto checkLogin(LoginForm form) {
        LoginDto loginDto = new LoginDto();
        try {
            if (companyRepository.findById(form.getComp_pk_num()).isPresent()) {
                Optional<UserEntity> userOptional = userRepository.findByUserId(form.getUser_id());
                if (userOptional.isPresent()) {
//                    System.out.println("--------userOptional.isPresent--------");
                    UserEntity user = userOptional.get();
                    if (!user.getUserLocked()) {
//                        System.out.println("--------getUserLocked--------");
                        if (checkPassword(user, form.getUser_pw())) {
//                            System.out.println("--------processSuccessfulLogin--------");
                            loginDto = processSuccessfulLogin(user);
                        }
                        else {
//                            System.out.println("--------login failed--------");
                            loginDto = processFailedLogin(user);
                        }
                    }
                    else {
                        loginDto = processLockedAccount(user);
                    }
                } else {
                    loginDto = processUserNotFound();
                }
            } else if (companyRepository.findById(form.getComp_pk_num()).isEmpty()) {
                loginDto = processCompanyNotFound();
            }
        } catch (Exception e) {
            logger.error("로그인 처리 중 오류 발생", e);
            loginDto = processLoginError();
        }
        return loginDto;
    }

    private boolean checkPassword(UserEntity user, String inputPassword) {
        if (passwordEncoder.matches(inputPassword, user.getUserPw())) {
            return true;
        } else if (user.getUserPw().equals(inputPassword)) {
            String encodedPassword = passwordEncoder.encode(inputPassword);
            user.setUserPw(encodedPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    private LoginDto processSuccessfulLogin(UserEntity user) {
        LoginDto loginDto = new LoginDto();
        user.setUserTrynum(0);
        user.setUserLocked(false);
        String accessToken = jwtUtil.generateAccessToken(user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken();
        LocalDateTime refreshTokenExpiry = LocalDateTime.now().plusDays(14);
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(refreshTokenExpiry);

//        System.out.println("-----------------login2  -----------------");
//        System.out.println(user.getUserPkNum());
//        System.out.println("-----------------login2  -----------------");

        userRepository.save(user);
        loginDto.setStatus(1);
        loginDto.setAccessToken(accessToken);
        loginDto.setRefreshToken(refreshToken);
        loginDto.setUser_pk_num(user.getUserPkNum());
        loginDto.setUser_id(user.getUserId());
        loginDto.setUser_name(user.getUserName());
        loginDto.setUser_mail(user.getUserMail());
        loginDto.setUser_pic(user.getUserPic());
        loginDto.setUser_author(user.getUserAuthor());
        loginDto.setUser_fk_comp_num(user.getCompanyEntity().getCompPkNum());
        loginDto.setUser_locked(false);
//        System.out.println("-----------------login2  -----------------");
//        System.out.println(loginDto.getUser_pk_num());
//        System.out.println("-----------------login2  -----------------");
        return loginDto;
    }

    private LoginDto processFailedLogin(UserEntity user) {
        LoginDto loginDto = new LoginDto();
        user.setUserTrynum(user.getUserTrynum() + 1);
        if (user.getUserTrynum() >= 5) {
            user.setUserLocked(true);
            user.setUserTrynum(0);
            loginDto.setUser_locked(user.getUserLocked());
        }
        userRepository.save(user);

        if(user.getUserLocked()) {
            loginDto.setStatus(3);
            System.out.println("locked");
        } else{
            loginDto.setStatus(2);
        }

        loginDto.setUser_trynum(user.getUserTrynum());

        return loginDto;
    }

    private LoginDto processLockedAccount(UserEntity user) {
        LoginDto loginDto = new LoginDto();
        loginDto.setStatus(3);
        loginDto.setUser_trynum(user.getUserTrynum());
        loginDto.setUser_locked(true);
        return loginDto;
    }

    private LoginDto processUserNotFound() {
        LoginDto loginDto = new LoginDto();
        loginDto.setStatus(2);
        return loginDto;
    }

    private LoginDto processCompanyNotFound() {
        LoginDto loginDto = new LoginDto();
        loginDto.setStatus(2);
        return loginDto;
    }

    private LoginDto processLoginError() {
        LoginDto loginDto = new LoginDto();
        loginDto.setStatus(4);
        return loginDto;
    }

    @Override
    public String generateAccessToken(UserDto userDto) {
        return jwtUtil.generateAccessToken(userDto.getUser_id());
    }

    @Override
    public String generateRefreshToken(UserDto userDto) {
        return jwtUtil.generateRefreshToken();
    }

    @Override
    public boolean validateAccessToken(String token) {
        return jwtUtil.validateAccessToken(token);
    }

    @Override
    public boolean validateRefreshToken(String token) {
        Optional<UserEntity> userOptional = userRepository.findByRefreshToken(token);
        return userOptional.isPresent() && LocalDateTime.now().isBefore(userOptional.get().getRefreshTokenExpiry());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserFromToken(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        return getUserInfo(userId);
    }

    @Override
    @Transactional
    public String refreshAccessToken(String refreshToken) {
        Optional<UserEntity> userOptional = userRepository.findByRefreshToken(refreshToken);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (LocalDateTime.now().isBefore(user.getRefreshTokenExpiry())) {
                String newAccessToken = jwtUtil.generateAccessToken(user.getUserId());
                String newRefreshToken = jwtUtil.generateRefreshToken();
                user.setRefreshToken(newRefreshToken);
                user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(14));
                userRepository.save(user);
                return newAccessToken;
            }
        }
        throw new IllegalArgumentException("Invalid or expired refresh token");
    }

    @Override
    @Transactional
    public void logout(String userId) {
        userRepository.findByUserId(userId).ifPresent(user -> {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiry(null);
            userRepository.save(user);
        });
    }

    @Override
    public String getUserIdFromRefreshToken(String refreshToken) {
        Optional<UserEntity> userOptional = userRepository.findByRefreshToken(refreshToken);
        if (userOptional.isPresent()) {
            return userOptional.get().getUserId();
        }
        throw new IllegalArgumentException("Invalid refresh token");
    }

    private String generateNewAccessToken(String userId) {
        return jwtUtil.generateAccessToken(userId);
    }

    private String generateNewRefreshToken(String userId) {
        return jwtUtil.generateRefreshToken();
    }

    private void updateRefreshTokenInDatabase(String userId, String newRefreshToken) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(14));
        userRepository.save(user);
    }

    public Map<String, String> refreshTokens(String refreshToken) {
        if (!validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String userId = getUserIdFromRefreshToken(refreshToken);
        String newAccessToken = generateNewAccessToken(userId);
        String newRefreshToken = generateNewRefreshToken(userId);
        updateRefreshTokenInDatabase(userId, newRefreshToken);
        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
    }

    @Override
    public String extractAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @Override
    public String extractRefreshToken(HttpServletRequest request) {
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
}
