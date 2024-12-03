package conect.service.board.post;

import java.util.List;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;

public interface PostService {
	// 삽입
	PostEntity insertPost(PostForm postForm);

	// 전체 조회
	List<PostDto> getPostAll();

	// 부분 조회
	PostDto getPost(int postPkNum);

	// 수정
	PostDto updatePost(int postPkNum, PostForm postForm);

	// 삭제
	void deletePost(int postPkNum);
}