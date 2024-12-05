package conect.service.board.post;

import conect.data.dto.PostDto;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
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
		PostDto dto = PostDto.fromEntity(frepository.findById(postPkNum).get());
		dto.setTarget_names(getTargetNames(dto.getPost_targetnum()));
		return dto;
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
	//targetNum 여러명 이름 불러오기
	public List<Map<Integer,String>> getTargetNames(String targetNumsString){
		StringTokenizer st = new StringTokenizer(targetNumsString,","); // nums String으로 관리하고, 구분자가 ',' 그래서 ,를 기준으로 스트링토크나이저 사용해서 각각의 토큰화
		List<Integer> userNums = new ArrayList<Integer>(); // 그 토큰을 INTEGER화 해서 담을 LIST => 순서가 필요없고 갯수가 정해져 있지 않아서 array X List O
		while(st.hasMoreTokens()) {// 토큰이 있을경우
			userNums.add(Integer.parseInt(st.nextToken())); // 다음 토큰을 찾아 이동하면서 해당 토큰(String) => parseInt => userNums라는 List<Integer>에 담아줌
		}
		//userNums 안에 데이터가 생김. 1개~ 그이상
		
		Map<Integer,String> usermap = new HashMap<>(); // Map<사번, 이름> 정보를 보관하는 맵 
		List<Map<Integer,String>> userMapList = new ArrayList<Map<Integer,String>>(); // 그 맵을 여러개 보관할 리스트
		for(int num : userNums) {
			String name = userRepository.findById(num).get().getUserName(); //유저의 번호 1개씩 요청해서 이름만 받아
			usermap.put(num, name); //받은 이름을 사번, 이름으로 맵 저장 => num으로 조회 => name은 그 num과 같은 데이터일수밖에 없음
			userMapList.add(usermap); //맵을 List 저장
		}
		return userMapList; // [{1:김민수},{2:이영희}] => find 배열을 순환적으로 돌아다니면서 사용자가 입력한 조건에 맞는 1개의 데이터를 찾아
	}
}