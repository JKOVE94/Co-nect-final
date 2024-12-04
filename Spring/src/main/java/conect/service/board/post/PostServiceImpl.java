package conect.service.board.post;

import conect.data.dto.PostDto;
import conect.data.entity.CompanyEntity;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostRepository frepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CompanyRepository companyRepository;
	
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
		postEntity.setUserEntity(userRepository.findById(postForm.getPost_fk_user_num()).get());
		postEntity.setCompanyEntity(companyRepository.findById(postForm.getPost_fk_comp_num()).get());
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
	public PostDto updatePost(int postPkNum, PostForm postForm) { // postId를 postPkNum으로 변경
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
			return PostDto.fromEntity(frepository.save(updatePost));
		}
		return null;
	}

	// 삭제
	@Override
	public void deletePost(int postPkNum) {
		frepository.deleteById(postPkNum);
	}
	// 페이징
		public Page<PostDto> getList(int page, int pageSize) {
		    Pageable pageable = PageRequest.of(page, 10);
		    Page<PostEntity> postPage = this.frepository.findAll(pageable);
		    
		    // PostEntity -> PostDto 변환
		    Page<PostDto> postDtoPage = postPage.map(post -> PostDto.fromEntity(post));

		    return postDtoPage;
		}
}