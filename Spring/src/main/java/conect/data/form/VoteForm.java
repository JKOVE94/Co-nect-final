package conect.data.form;

import java.time.LocalDateTime;

import conect.data.entity.VoteEntity;
import conect.data.entity.VoteEntity.EndType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteForm {
	private int vote_pk_num;
	private LocalDateTime vote_start; //투표 시작일
	private LocalDateTime vote_end; //투표 종료일
	private int vote_for; //찬성 표
	private int vote_against; //반대 표
	private String vote_voter; //투표한 사람의 pk num
	private EndType vote_endtype;
	private int vote_isend;//종료여부 [TINYINT] (false 0, true 1)

	public static VoteEntity toEntity(VoteForm form) {
		VoteEntity entity = new VoteEntity();
		entity.setVotePkNum(form.getVote_pk_num());
		entity.setVoteStart(form.getVote_start());
		entity.setVoteEnd(form.getVote_end());
		entity.setVoteFor(form.getVote_for());
		entity.setVoteAgainst(form.getVote_against());
		entity.setVoteVoter(form.getVote_voter());
		entity.setVoteEndtype(form.getVote_endtype());
		entity.setVoteIsend(form.getVote_isend());
		return entity;
	}
}
