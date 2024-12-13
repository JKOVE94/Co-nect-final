package conect.data.dto;

import java.time.LocalDateTime;

import conect.data.entity.ProjectEntity;
import conect.data.entity.RecommendationEntity;
import conect.data.entity.UserEntity;
import conect.data.entity.VoteEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationDto {
	
	private int rec_pk_num; 
	private String rec_title; //제목
	private String rec_content; //내용
	private LocalDateTime rec_date; //작성일자
	
	private int user_pknum;
	private String user_name;
	
	private String proj_members;
	
	private int vote_pk_num;
	private LocalDateTime vote_start; //투표 시작일
	private LocalDateTime vote_end; //투표 종료일
	private int vote_for; //찬성 표
	private int vote_against; //반대 표
	private String vote_voter; //투표한 사람의 pk num
	private String vote_endtype;
	private int vote_isend;//종료여부 [TINYINT] (false 0, true 1)
	
	public static RecommendationDto fromEntity(RecommendationEntity entity) {
		RecommendationDto dto = new RecommendationDto();
		dto.setRec_title(entity.getRecTitle());
		dto.setRec_pk_num(entity.getRecPkNum());
		dto.setRec_content(entity.getRecContent());
		dto.setRec_date(entity.getRecDate());
		dto.setUser_pknum(entity.getUserEntity().getUserPkNum());
		dto.setUser_name(entity.getUserEntity().getUserName());
		dto.setProj_members(entity.getProjectEntity().getProjMembers());
		dto.setVote_pk_num(entity.getVoteEntity().getVotePkNum());
		dto.setVote_start(entity.getVoteEntity().getVoteStart());
		dto.setVote_end(entity.getVoteEntity().getVoteEnd());
		dto.setVote_for(entity.getVoteEntity().getVoteFor());
		dto.setVote_against(entity.getVoteEntity().getVoteAgainst());
		dto.setVote_voter(entity.getVoteEntity().getVoteVoter());
		dto.setVote_endtype(entity.getVoteEntity().getVoteEndtype().toString());
		dto.setVote_isend(entity.getVoteEntity().getVoteIsend());
		return dto;
	}

}
