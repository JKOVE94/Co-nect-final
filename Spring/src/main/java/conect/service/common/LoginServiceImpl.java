package conect.service.common;

import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.LoginForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.UserRepository;
import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserDto getUserInfo(String userId) {
        return UserDto.fromEntity(userRepository.findByUserId(userId).orElseThrow());
    }

    @Override
    public int getTryNum(String userId) {
        return userRepository.findByUserId(userId).orElseThrow().getUserTrynum();
    }

    @Override
    public LoginDto checkLogin(LoginForm form) {
        LoginDto loginDto = new LoginDto();
        try {
            if (companyRepository.findById(form.getComp_pk_num()).isPresent()) {
                Optional<UserEntity> userOptional = userRepository.findByUserId(form.getUser_id());
                if (userOptional.isPresent()) {
                    UserEntity user = userOptional.get();
                    if (!user.getUserLocked()) {
                        if (user.getUserPw().equals(form.getUser_pw())) {
                            user.setUserTrynum(0);
                            userRepository.save(user);
                            
                            String token = jwtUtil.generateToken(user.getUserId());
                            
                            loginDto.setStatus(1);
                            loginDto.setToken(token);
                            loginDto.setUser_pk_num(user.getUserPkNum());
                            loginDto.setUser_id(user.getUserId());
                            loginDto.setUser_name(user.getUserName());
                            loginDto.setUser_mail(user.getUserMail());
                            loginDto.setUser_pic(user.getUserPic());
                            loginDto.setUser_pictype(user.getUserPic());
                            loginDto.setUser_fk_acc_authornum(user.getUserAuthor());
                            loginDto.setUser_fk_comp_num(user.getCompanyEntity().getCompPkNum());
                        } else {
                            handleFailedLogin(user);
                            loginDto.setStatus(2);
                            loginDto.setUser_trynum(user.getUserTrynum());
                        }
                    } else {
                        loginDto.setStatus(3);
                        loginDto.setUser_trynum(user.getUserTrynum());
                    }
                } else {
                    loginDto.setStatus(2);
                }
            } else {
                loginDto.setStatus(2);
            }
        } catch(Exception e) {
            loginDto.setStatus(2);
        }
        return loginDto;
    }

    private void handleFailedLogin(UserEntity user) {
        user.setUserTrynum(user.getUserTrynum() + 1);
        if(user.getUserTrynum() == 6) {
            user.setUserLocked(true);
            user.setUserTrynum(0);
        }
        userRepository.save(user);
    }

    @Override
    public String generateToken(UserDto userDto) {
        return jwtUtil.generateToken(userDto.getUser_id());
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public UserDto getUserFromToken(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        return getUserInfo(userId);
    }
}
