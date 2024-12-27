package conect.service.board.reply;

import java.util.List;

import conect.data.dto.ReplyDto;
import conect.data.form.ReplyForm;

public interface replyService {
	
	//--댓글--
	//모든 댓글
	List<ReplyDto> getReplyAll(int recNum);
	//댓글 등록
	void addRecReply(ReplyForm bean);
	//댓글 수정
	ReplyDto editReply(ReplyForm bean);
	//댓글 삭제
	void dropReply(int replyPkNum);
	
	//--댓글 좋아요--
	//로그인한 유저가 댓글 좋아요 눌렀는지 확인
	boolean checkReplylike(int usernum, int replynum);
	//댓글 좋아요 등록
	void addReplylike(int usernum, int replynum);
	//댓글 좋아요 삭제
	void dropReplylike(int usernum, int replynum);

}
