package conect.data.dto;

import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class UserDto {

    private Integer user_pk_num; // 사원 사번
    private String user_id; // 사원 아이디
    private String user_name; // 사원 이름
    private String user_mail; // 사원 이메일
    private String user_pic; // 사원 사진
    private LocalDateTime user_lastlogin; // 사원 마지막 로그인 일시
    private int user_trynum; // 사원 로그인 시도 횟수
    private boolean user_locked; // 사원 계정 잠김 여부
    private int user_author; // 사원 권한
    private boolean user_istemppw; // 사원 임시 비밀번호 여부
    private int user_fk_comp_num; // 사원 회사 번호

    // user_pw 필드는 보안상의 이유로 DTO에서 제거했습니다.

    public static UserDto fromEntity(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setUser_pk_num(user.getUserPkNum());
        userDto.setUser_id(user.getUserId());
        userDto.setUser_name(user.getUserName());
        userDto.setUser_mail(user.getUserMail());
        userDto.setUser_pic(user.getUserPic());
        userDto.setUser_lastlogin(user.getUserLastlogin());
        userDto.setUser_trynum(user.getUserTrynum());
        userDto.setUser_locked(user.getUserLocked());
        userDto.setUser_author(user.getUserAuthor());
        userDto.setUser_istemppw(user.getUserIstemppw());
        userDto.setUser_fk_comp_num(user.getCompanyEntity().getCompPkNum());
        return userDto;

    }
}
