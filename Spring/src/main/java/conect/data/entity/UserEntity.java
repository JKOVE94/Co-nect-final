package conect.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Setter
@Getter
@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    private Integer userPkNum; // 사용자 사번 [INT, PK]

    private String userId; // 사용자 아이디 [VARCHAR, NN]

    @JsonIgnore
    private String userPw; // 사용자 패스워드 [VARCHAR, NN]

    private String userName; // 사용자 이름 [VARCHAR]
    private String userMail; // 사용자 이메일 [VARCHAR]
    private String userPic; // 사용자 사진 [LONGBLOB]
    private LocalDateTime userLastlogin; // 사용자 마지막 로그인 일시 [DATETIME]
    private Boolean userIstemppw; // 임시 비밀번호 여부 [TINYINT] (false 0, true 1)
    private int userTrynum; // 사용자 로그인 시도 횟수 [INT] (로그인 실패 시 증가)

    @Column(name = "user_Locked")
    private Boolean userLocked; // 사용자 계정 잠김 여부 [TINYINT] (false 0, true 1)

    private int userAuthor; // 사용자 권한 [INT] (1, 2, 3, 4)

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "refresh_token_expiry")
    private LocalDateTime refreshTokenExpiry;

    @ManyToOne
    @JoinColumn(name = "user_fk_comp_num")
    @JsonIgnore
    private CompanyEntity companyEntity;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<FavoritesEntity> favoritesEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ReclikesEntity> reclikesEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ReplyEntity> replyEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<TodoEntity> todoEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ProjectmemberEntity> projectmemberEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<RecommendationEntity> recommendationEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ReplyLikesEntity> replyLikesEntities;

    @OneToMany(mappedBy = "userEntity", orphanRemoval = true, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ProjectEntity> projectEntities;
}
