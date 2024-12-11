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
@Table(name = "post") // 데이터베이스의 'post' 테이블과 매핑
public class PostEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키이며, 자동 증가 설정
    private int postPkNum; // 게시글 고유 번호 [PK, INT, INCREMENT]

    private int postKind; // 게시글 유형 [INT]

    private String postTargetnum; // 게시글 대상 사원번호 [VARCHAR]
    // StringTokenizer 등을 사용하여 여러 대상 처리 가능

    private String postName; // 게시글 제목 [VARCHAR]

    private LocalDateTime postRegdate; // 게시글 등록일 [DATETIME]

    private String postImport; // 게시글 중요도 [VARCHAR] (낮음, 보통, 높음, 매우 높음)

    private String postContent; // 게시글 내용 [TEXT]

    private String postTag; // 게시글 태그 [VARCHAR]

    private int postDepth; // 게시글 깊이 [INT] (기본값 0, 답글 설정 시 사용)

    private int postView; // 게시글 조회수 [INT]

    private int postTemp; // 게시글 임시저장 상태 [TINYINT]

    // 게시글 작성자 (UserEntity와 다대일 관계)
    @ManyToOne
    @JoinColumn(name = "post_fk_user_num") // 외래 키: post_fk_user_num
    @JsonIgnore // 순환 참조 방지를 위해 JSON 직렬화에서 제외
    private UserEntity userEntity;

    // 회사 정보 (CompanyEntity와 다대일 관계)
    @ManyToOne
    @JoinColumn(name = "post_fk_comp_num") // 외래 키: post_fk_comp_num
    @JsonIgnore // 순환 참조 방지를 위해 JSON 직렬화에서 제외
    private CompanyEntity companyEntity;

    // 댓글 정보 (ReplyEntity와 일대다 관계)
    @OneToMany(mappedBy = "postEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonBackReference // 순환 참조 방지를 위해 사용
    private List<ReplyEntity> replyEntities;

    // 즐겨찾기 정보 (FavoritesEntity와 일대다 관계)
    @OneToMany(mappedBy = "postEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonBackReference // 순환 참조 방지를 위해 사용
    private List<FavoritesEntity> favoritesEntities;
}