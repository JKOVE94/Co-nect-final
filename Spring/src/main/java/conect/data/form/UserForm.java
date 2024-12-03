package conect.data.form;

import conect.data.entity.AccountEntity;
import conect.data.entity.CompanyEntity;
import conect.data.entity.DepartmentEntity;
import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
public class UserForm {
    private Integer user_pk_num; //사용자 사번 [INT, PK]
    private String user_regdate; //입사일 [DATETIME]
    private String user_pw; //사용자 패스워드 [VARCHAR, NN]
    private String user_name; //사용자 이름 [VARCHAR]
    private String user_mail; //사용자 이메일 [VARCHAR]
    private String user_pic; //사용자 사진 [LONGBLOB]
    private MultipartFile user_picfile; //사용자 사진 파일
    private String user_pictype; //사용자 사진 확장자 [VARCHAR]
    private String user_rank; //사용자 직급 [VARCHAR]
    private String user_lastlogin; //사용자 마지막 로그인 일시 [DATETIME]
    private int user_trynum; //사용자 로그인 시도 횟수 [INT] (로그인 실패 시 증가)
    private int user_locked; //사용자 계정 잠김 여부 [TINYINT] (false 0, true 1)
    private int user_fk_dpart_num; //사용자 부서번호 [FK, INT]
    private int user_fk_acc_authornum; //사용자 계정 권한 번호 [FK, INT]
    private int user_fk_comp_num; //사용자 회사 고유번호 [FK, INT] (랜딩 페이지에서 입력한 회사 번호가 모든 페이지에서 따라다닐수 있도록 redux에 설정

    public static UserEntity toEntity(UserForm form) {
        Date regdate = null;
        Date lastlogin = null;
        SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if (form.getUser_regdate() != null && !form.getUser_regdate().isEmpty()) {
                regdate = transFormat.parse(form.getUser_regdate());
            }
            if (form.getUser_lastlogin() != null && !form.getUser_lastlogin().isEmpty()) {
                lastlogin = transFormat.parse(form.getUser_lastlogin());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // fk 관련된 데이터는 service 단에서 findById로 찾아야 함
        UserEntity entity = new UserEntity();
        entity.setUserPkNum(form.getUser_pk_num());
        entity.setUserRegdate(regdate);
        entity.setUserPw(form.getUser_pw());
        entity.setUserName(form.getUser_name());
        entity.setUserMail(form.getUser_mail());
        entity.setUserPic(form.getUser_pic());
        entity.setUserPictype(form.getUser_pictype());
        entity.setUserRank(form.getUser_rank());
        entity.setUserLastlogin(lastlogin);
        entity.setUserTrynum(form.getUser_trynum());
        entity.setUserLocked(form.getUser_locked());
        return entity;
    }
}