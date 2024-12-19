package conect.service.board.recommendation;

import java.util.List;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.data.form.TodoForm;

public interface recommendationService {

	List<RecommendationDto> getRecAll(int num);
	void addRecData(RecommendationForm bean);
	RecommendationDto getRecData(int projNum, int recNum);
	boolean checkReclike(int usernum, int recnum);
	void addReclike(int usernum, int recnum);
	void delReclike(int usernum, int recnum);
	boolean checkReplylike(int usernum, int replynum);
	void addReplylike(int usernum, int replynum);
	void delReplylike(int usernum, int replynum);
	RecommendationDto updateRecData(int recNum, RecommendationForm bean);
	void delRecData(int recPkNum);
	void addRecReply(ReplyForm bean);
	List<ReplyDto> getReplyAll(int num);
	void delReplyData(int replyPkNum);
}
