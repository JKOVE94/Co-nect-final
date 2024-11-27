package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    private int userPkNum; //사용자 사번 [INT, PK]
    private Date userRegdate; //입사일 [DATETIME]
    private String userPw; //사용자 패스워드 [VARCHAR, NN]
    private String userName; //사용자 이름 [VARCHAR]
    private String userMail; //사용자 이메일 [VARCHAR]
    private String userPic; //사용자 사진 경로 [VARCHAR] (상대경로 사용 0_asset/emp_pic)
    private String userRank; //사용자 직급 [VARCHAR]
    private Date userLastlogin; //사용자 마지막 로그인 일시 [DATETIME]
    private int userTrynum; //사용자 로그인 시도 횟수 [INT] (로그인 실패 시 증가)
    private int userLocked; //사용자 계정 잠김 여부 [TINYINT] (false 0, true 1)

    @ManyToOne
    @JoinColumn(name="user_fk_acc_authornum")
    private AccountEntity accountEntity;

    @ManyToOne
    @JoinColumn(name="user_fk_comp_num")
    private CompanyEntity companyEntity;

    @ManyToOne
    @JoinColumn(name="user_fk_dpart_num")
    private DepartmentEntity departmentEntity;

    @OneToMany(mappedBy = "userEntity")
    private List<FavoritesEntity> favoritesEntities;
}