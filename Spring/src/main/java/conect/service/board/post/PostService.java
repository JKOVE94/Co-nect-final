package conect.service.board.post;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface PostService {
	// 삽입
	PostEntity insertPost(PostForm postForm);

	// 전체 조회
	List<PostDto> getPostAll();

	// 부분 조회 및 조회수 증가
	public PostDto getPostView(Integer postPkNum, HttpServletRequest request, HttpServletResponse response);

	// 수정
	PostDto updatePost(int postPkNum, PostForm postForm);

	// 삭제
	void deletePost(int postPkNum);

	// 페이징 
	public Page<PostDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText);

}
