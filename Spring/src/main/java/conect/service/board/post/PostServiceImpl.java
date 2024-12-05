package conect.service.board.post;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.data.repository.PostRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService {

    
    @Autowired
	private PostRepository frepository;
	
	// 삽입
	@Override
	public PostEntity insertPost(PostForm postForm) {
		PostEntity postEntity = new PostEntity();

		postEntity.setPostKind(postForm.getPost_kind());
		postEntity.setPostTargetnum(postForm.getPost_targetnum());
		postEntity.setPostName(postForm.getPost_name());
		postEntity.setPostRegdate(postForm.getPost_regdate());
		postEntity.setPostImport(postForm.getPost_import());
		postEntity.setPostContent(postForm.getPost_content());
		postEntity.setPostTag(postForm.getPost_tag());
		postEntity.setPostDepth(postForm.getPost_depth());
		postEntity.setPostView(postForm.getPost_view());

		return frepository.save(postEntity);
	}

	// 전체 조회
	@Override
	public List<PostDto> getPostAll() {
		return frepository.findAll().stream().map(PostDto::fromEntity).collect(Collectors.toList());
	}

	// 부분 조회
	@Override
	public PostDto getPost(int postPkNum) {
		return frepository.findById(postPkNum).map(PostDto::fromEntity)
				.orElseThrow(() -> new RuntimeException("Post not found with ID: " + postPkNum));
	}

	// 수정
	@Override
	public PostEntity updatePost(int postPkNum, PostForm postForm) { // postId를 postPkNum으로 변경
		PostEntity updatePost = frepository.findById(postPkNum).orElse(null); // postId를 postPkNum으로 변경
		if (updatePost != null) {

			updatePost.setPostKind(postForm.getPost_kind());
			updatePost.setPostTargetnum(postForm.getPost_targetnum());
			updatePost.setPostName(postForm.getPost_name());
			updatePost.setPostRegdate(postForm.getPost_regdate());
			updatePost.setPostImport(postForm.getPost_import());
			updatePost.setPostContent(postForm.getPost_content());
			updatePost.setPostTag(postForm.getPost_tag());
			updatePost.setPostDepth(postForm.getPost_depth());
			updatePost.setPostView(postForm.getPost_view());
			return frepository.save(updatePost);
		}
		return null;
	}
    
    public List<PostDto> getAllPostWithUser(int user_pk_num){
    	return frepository.getPostByTaskFkUserNum(user_pk_num).stream()
                .map(PostDto:: fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
	public void deletePost(int postPkNum) {
		frepository.deleteById(postPkNum);
	}


}
