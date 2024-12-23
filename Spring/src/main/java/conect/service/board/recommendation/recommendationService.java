package conect.service.board.recommendation;

import java.util.List;

import conect.data.dto.ReclikesDto;
import conect.data.dto.RecommendationDto;
import conect.data.dto.ReplyDto;
import conect.data.form.RecommendationForm;
import conect.data.form.ReplyForm;
import conect.data.form.TodoForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public interface recommendationService {
	
	//--건의사항 게시글--
	//모든 건의사항
	Page<RecommendationDto> getRecAll(int projNum, String sortField, String sortDirection, int page, int size);
	//건의사항 게시글 상세 조회
	RecommendationDto getRecOne(int projNum, int recNum);
	//건의사항 게시글 조회수 증가(1일 1회 증가)
	void addRecView(int recNum, HttpServletRequest request, HttpServletResponse response);
	//건의사항 등록
	void addRec(RecommendationForm bean);
	//건의사항 수정
	RecommendationDto editRec(int recNum, RecommendationForm bean);
	//건의사항 삭제
	void dropRec(int recNum);
	//좋아요가 가장 많은 건의사항 게시글
	Page<RecommendationDto> getMostLike(int projnum);
	
	//--건의사항 좋아요--
	//로그인한 유저가 건의사항 좋아요 눌렀는지 확인
	boolean checkReclike(int userNum, int recNum);
	//건의사항 좋아요 등록
	void addReclike(int userNum, int recNum);
	//건의사항 좋아요 삭제
	void dropReclike(int userNum, int recNum);
	
}
