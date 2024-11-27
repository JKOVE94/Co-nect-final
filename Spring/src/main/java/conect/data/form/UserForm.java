package conect.data.form;

import conect.data.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserForm {
    private int user_pk_num;
    private Date user_regdate;
    private String user_pw;
    private String user_name;
    private String user_mail;
    private String user_pic;
    private String user_rank;
    private Date user_lastlogin;
    private int user_trynum;
    private int user_locked;

    public UserEntity toEntity() {
        UserEntity entity = new UserEntity();
        entity.setUserPkNum(this.user_pk_num);
        entity.setUserRegDate(this.user_regdate);
        entity.setUserPw(this.user_pw);
        entity.setUserName(this.user_name);
        entity.setUserMail(this.user_mail);
        entity.setUserPic(this.user_pic);
        entity.setUserRank(this.user_rank);
        entity.setUserLastLogin(this.user_lastlogin);
        entity.setUserTryNum(this.user_trynum);
        entity.setUserLocked(this.user_locked);
        return entity;
    }
}