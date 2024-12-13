package conect.data.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
	private int recPkNum; 
	private String recTitle; //제목
	private String recContent; //내용
	private LocalDateTime recDate; //작성일자
	
	@ManyToOne
	@JoinColumn(name = "rec_fk_user_num")
	@JsonIgnore
	private UserEntity userEntity; //작성자
	
	@ManyToOne
	@JoinColumn(name = "rec_fk_proj_num")
	@JsonIgnore
	private ProjectEntity projectEntity; //관련 project pk num
	
	@OneToOne(mappedBy = "recommendationEntity", cascade = CascadeType.REMOVE)
	private VoteEntity voteEntity;

}
