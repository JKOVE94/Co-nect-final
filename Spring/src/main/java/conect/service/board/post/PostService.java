package conect.service.board.post;

import java.util.List;

import conect.data.dto.PostDto;


public interface PostService {
	
	 List <PostDto> getAllPostWithUser(int user_pk_num);

}
