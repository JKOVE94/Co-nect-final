package conect.data.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="recommendation")
public class RecommendationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int recPkNum; //고유번호
	
	private String recTitle; //제목
	private String recContent; //내용
	private LocalDateTime recRegdate; //작성일자
	private int recView;
	
	@ManyToOne
	@JoinColumn(name = "rec_fk_user_num")
	@JsonIgnore
	private UserEntity userEntity; //작성자
	
	@ManyToOne
	@JoinColumn(name = "rec_fk_proj_num")
	@JsonIgnore
	private ProjectEntity projectEntity; //관련 프로젝트
	
	@OneToMany(mappedBy = "recommendation", orphanRemoval = true)
    @JsonBackReference
	private List<ReclikesEntity> reclikes;


}
