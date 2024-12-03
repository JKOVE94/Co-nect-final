package conect.service.board.post;

import conect.data.dto.PostDto;
import conect.data.repository.PostRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository frepository;
    
    public List<PostDto> getAllPostWithUser(int user_pk_num){
    	return frepository.getPostByTaskFkUserNum(user_pk_num).stream()
                .map(PostDto:: fromEntity)
                .collect(Collectors.toList());
    }


}
