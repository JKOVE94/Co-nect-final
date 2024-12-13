package conect.data.dto;

import java.time.LocalDateTime;

import conect.data.entity.VoteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteDto {
	private int vote_pk_num;
	private LocalDateTime vote_start; //투표 시작일
	private LocalDateTime vote_end; //투표 종료일
	private int vote_for; //찬성 표
	private int vote_against; //반대 표
	private String vote_voter; //투표한 사람의 pk num
	private String vote_endtype;
	private int vote_isend;//종료여부 [TINYINT] (false 0, true 1)

	public static VoteDto fromEntity(VoteEntity entity) {
		VoteDto dto = new VoteDto();
		dto.setVote_pk_num(entity.getVotePkNum());
		dto.setVote_start(entity.getVoteStart());
		dto.setVote_end(entity.getVoteEnd());
		dto.setVote_for(entity.getVoteFor());
		dto.setVote_against(entity.getVoteAgainst());
		dto.setVote_voter(entity.getVoteVoter());
		dto.setVote_endtype(entity.getVoteEndtype().toString());
		dto.setVote_isend(entity.getVoteIsend());
		return dto;
	}
}
