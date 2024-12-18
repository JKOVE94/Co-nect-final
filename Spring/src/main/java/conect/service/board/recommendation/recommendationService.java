package conect.service.board.recommendation;

import java.util.List;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.form.RecommendationForm;
import conect.data.form.TodoForm;

public interface recommendationService {

	List<RecommendationDto> getRecAll(int num);
	void addRecData(RecommendationForm bean);
	RecommendationDto getRecData(int projNum, int recNum);
	boolean checkReclike(int usernum, int recnum);
	void addReclike(int usernum, int recnum);
	void delReclike(int usernum, int recnum);
	RecommendationDto updateRecData(int recNum, RecommendationForm bean);
	void delRecData(int recPkNum);
}
