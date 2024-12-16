package conect.service.common;

import conect.data.dto.DepartmentDto;
import conect.data.dto.LoginDto;
import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.LoginForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.DepartmentRepository;
import conect.data.repository.UserRepository;
import conect.data.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserDto getUserInfo(int user_pk_num) {
        return UserDto.fromEntity(userRepository.findById(user_pk_num).orElseThrow());
    }

    @Override
    public int getTryNum(int user_pk_num) {
        return userRepository.findById(user_pk_num).orElseThrow().getUserTrynum();
    }

    @Override
    public LoginDto checkLogin(LoginForm form) {
        LoginDto loginDto = new LoginDto();
        try {
            if (companyRepository.findById(form.getComp_pk_num()).isPresent()) {
                Optional<UserEntity> userOptional = userRepository.findById(form.getUser_pk_num());
                if (userOptional.isPresent()) {
                    UserEntity user = userOptional.get();
                    if (user.getUserLocked() != 1) {
                        if (user.getUserPw().equals(form.getUser_pw())) {
                            user.setUserTrynum(0);
                            userRepository.save(user);
                            
                            String token = jwtUtil.generateToken(String.valueOf(user.getUserPkNum()));
                            
                            loginDto.setStatus(1);
                            loginDto.setToken(token);
                            loginDto.setUser_pk_num(user.getUserPkNum());
                            loginDto.setUser_name(user.getUserName());
                            loginDto.setUser_mail(user.getUserMail());
                            loginDto.setUser_pic(user.getUserPic());
                            loginDto.setUser_pictype(user.getUserPictype());
                            loginDto.setUser_rank(user.getUserRank());
                            loginDto.setUser_fk_dpart_num(user.getDepartmentEntity().getDpartPkNum());
                            loginDto.setUser_fk_acc_authornum(user.getAccountEntity().getAccPkAuthornum());
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
            user.setUserLocked(1);
            user.setUserTrynum(0);
        }
        userRepository.save(user);
    }

    @Override
    public List<DepartmentDto> getDeparts() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public String generateToken(UserDto userDto) {
        return jwtUtil.generateToken(String.valueOf(userDto.getUser_pk_num()));
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public UserDto getUserFromToken(String token) {
        String userPkNum = jwtUtil.getUsernameFromToken(token);
        return getUserInfo(Integer.parseInt(userPkNum));
    }
}
