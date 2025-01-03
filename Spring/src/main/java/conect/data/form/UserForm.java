package conect.data.form;

import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class UserForm {
    private Integer user_pk_num; // 사원 사번
    private String user_id; // 사원 아이디
    private String user_pw; // 사원 패스워드
    private String user_name; // 사원 이름
    private String user_mail; // 사원 이메일
    private String user_pic; // 사원 사진
    private LocalDateTime user_lastlogin; // 사원 마지막 로그인 일시
    private int user_trynum; // 사원 로그인 시도 횟수
    private boolean user_locked; // 사원 계정 잠김 여부
    private int user_author; // 사원 권한
    private boolean user_istemppw; // 사원 임시 비밀번호 여부
    private int user_fk_comp_num; // 사원 회사 번호
    private MultipartFile user_picfile; // 사원 사진 파일

    public static UserEntity toEntity(UserForm form) {
        UserEntity entity = new UserEntity();
        entity.setUserPkNum(form.getUser_pk_num());
        entity.setUserId(form.getUser_id());
        entity.setUserPw(form.getUser_pw());
        entity.setUserName(form.getUser_name());
        entity.setUserMail(form.getUser_mail());
        entity.setUserPic(form.getUser_pic());
        entity.setUserLastlogin(form.getUser_lastlogin());
        entity.setUserTrynum(form.getUser_trynum());
        entity.setUserLocked(form.isUser_locked());
        entity.setUserAuthor(form.getUser_author());
        entity.setUserIstemppw(form.isUser_istemppw());
        return entity;
    }
}