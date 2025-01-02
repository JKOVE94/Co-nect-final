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
@Table(name = "post")
public class PostEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int postPkNum; // 게시글 번호 [PK, INT, INCREMENT]
	private int postKind; // 게시글 유형 [INT]
	private String postTargetnum; // 게시글 대상 사원번호 [VARCHAR] => String으로 작성 이후 데이터사용은 String tokenizer 사용
	private String postName; // 게시글 제목 [VARCHAR]
	private LocalDateTime postRegdate; // 게시글 등록일 [DATETIME]
	private String postImport; // 게시글 중요도 [VARCHAR] (낮음,보통,높음,매우 높음)
	private String postContent; // 게시글 내용 [TEXT]
	private String postTag; // 게시글 태그 [VARCHAR]
	private int postDepth; // 게시글 깊이 [INT] (기본값 0, 답글 설정시 사용)
	private int postView; // 게시글 조회수 [INT]
	private int postTemp;// 게시글 임시저장 상태[TINYINT]

	@ManyToOne
	@JoinColumn(name = "post_fk_user_num")
	@JsonIgnore
	private UserEntity userEntity;

	@ManyToOne
	@JoinColumn(name = "post_fk_comp_num")
	@JsonIgnore
	private CompanyEntity companyEntity;

	@OneToMany(mappedBy = "postEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonBackReference
	private List<FavoritesEntity> favoritesEntities;
}
