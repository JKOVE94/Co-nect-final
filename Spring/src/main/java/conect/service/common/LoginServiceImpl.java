package conect.service.common;

import conect.data.dto.UserDto;
import conect.data.entity.UserEntity;
import conect.data.form.LoginForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    /*
    로그인 상태를 숫자로 정의
    1 : 로그인 성공
    2 : 정보 불일치
    3 : 잠긴 계정
     */

    @Override
    public UserDto getUserInfo(int user_pk_num) {
//        return UserDto.fromEntity(userRepository.findById(user_pk_num).get());
        return null;
    }

    @Override
    public int getTryNum(int user_pk_num){ //로그인 시도횟수를 반환하는 메소드
        return userRepository.findById(user_pk_num).get().getUserTrynum();
    }

    @Override
    public int checkLogin(LoginForm form) {
        try {
            //DB에 해당 정보가 있는가?
            if (companyRepository.findById(form.getComp_pk_num()).get() != null) {
                //로그인 시도 횟수가 5회 미만인가?
                if (userRepository.findById(form.getUser_pk_num()).get().getUserLocked() != 1) {
                    UserEntity user = userRepository.findById(form.getUser_pk_num()).get();
                    //유저가 입력한 pw와 DB의 pw가 일치하는가?
                    if (user.getUserPw().equals(form.getUser_pw())) {
                        user.setUserTrynum(0); //시도횟수 초기화
                        userRepository.save(user); //초기화정보 저장
                        return 1; //로그인 성공
                    }
                    //pw가 일치하지 않다면?
                    else {
                        System.out.println("전 : "+user.getUserTrynum());
                        user.setUserTrynum(user.getUserTrynum() + 1); //로그인 시도횟수 증가
                        if(user.getUserTrynum()==6){
                            user.setUserLocked(1); //계정 잠금
                            user.setUserTrynum(0); //계정 잠금 이후 tryNum 초기화 => 관리자의 로직에서는 Locked만 조절하면 됨
                        }
                        userRepository.save(user);
                        System.out.println("후 : "+user.getUserTrynum());
                        return 2; //정보 불일치
                    }
                } else return 3; //잠긴 계정

            }else return 2; //정보 불일치 - 해당 user_pk_num 없음
        }catch(Exception e){
            return 2; //정보 불일치 - 해당 user_pk_num 없음 (Exception)
        }
    }
}
