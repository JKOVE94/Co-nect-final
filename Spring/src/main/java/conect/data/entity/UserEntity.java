package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Setter
@Getter
@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    private Integer userPkNum; //사용자 사번 [INT, PK]
    private Date userRegdate; //입사일 [DATETIME]
    private String userPw; //사용자 패스워드 [VARCHAR, NN]
    private String userName; //사용자 이름 [VARCHAR]
    private String userMail; //사용자 이메일 [VARCHAR]
    private String userPic; //사용자 사진 [LONGBLOB]
    private String userPictype; //사용자 사진 확장자 [VARCHAR]
    private String userRank; //사용자 직급 [VARCHAR]
    private Date userLastlogin; //사용자 마지막 로그인 일시 [DATETIME]
    private int userTrynum; //사용자 로그인 시도 횟수 [INT] (로그인 실패 시 증가)
    private int userLocked; //사용자 계정 잠김 여부 [TINYINT] (false 0, true 1)

    @ManyToOne
    @JoinColumn(name="user_fk_acc_authornum")
    @JsonIgnore
    private AccountEntity accountEntity;

    @ManyToOne
    @JoinColumn(name="user_fk_comp_num")
    @JsonIgnore
    private CompanyEntity companyEntity;

    @ManyToOne
    @JoinColumn(name="user_fk_dpart_num")
    @JsonIgnore
    private DepartmentEntity departmentEntity;

    @OneToMany(mappedBy = "userEntity",orphanRemoval = true)
    @JsonBackReference
    private List<FavoritesEntity> favoritesEntities;
    
    @OneToMany(mappedBy = "userEntity", orphanRemoval = true)
    @JsonBackReference
    private List<NoticeEntity> noticeEntity;

}