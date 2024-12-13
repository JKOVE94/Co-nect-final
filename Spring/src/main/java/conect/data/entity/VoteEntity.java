package conect.data.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="vote")
public class VoteEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int votePkNum;
	private LocalDateTime voteStart; //투표 시작일
	private LocalDateTime voteEnd; //투표 종료일
	private int voteFor; //찬성 표
	private int voteAgainst; //반대 표

	@Column(columnDefinition = "TEXT")
	private String voteVoter; //투표한 사람의 pk num
	
	@Enumerated(EnumType.STRING)
	private  EndType voteEndtype;
	
	private int voteIsend;//종료여부 [TINYINT] (false 0, true 1)
	
	@OneToOne
	@JoinColumn(name="vote_fk_rec_num")
	private RecommendationEntity recommendationEntity;
	
	public enum EndType{
		Vote,
		Join,
		Period
	}

}

