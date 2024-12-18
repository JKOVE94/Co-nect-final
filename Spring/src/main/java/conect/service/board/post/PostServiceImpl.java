package conect.service.board.post;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.data.repository.CompanyRepository;
import conect.data.repository.PostRepository;
import conect.data.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import java.util.Optional;

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
		return frepository.findAll()
				.stream()
				.map(PostDto::fromEntity)
				.collect(Collectors.toList());
	}

	// 부분 조회, 조회수(Cookie)
	@Override
    public PostDto getPostView(Integer postPkNum, HttpServletRequest request, HttpServletResponse response) {
        // 조회수 증가 로직
		// frepository.incrementView(postPkNum); // 조회수 증가 쿼리 실행
		
        Cookie oldCookie = null;
        Cookie[] cookies = request.getCookies();
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("postView")) {
                    oldCookie = cookie;
                }
            }
        }

        if (oldCookie != null) {
            // 쿠키 값에 게시글 ID가 없다면 조회수 증가
            if (!oldCookie.getValue().contains("[" + postPkNum.toString() + "]")) {
                updateHits(postPkNum); // 조회수 증가
                oldCookie.setValue(oldCookie.getValue() + "_[" + postPkNum + "]"); // 쿠키 값에 게시글 ID 추가
                oldCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효 기간 1일
                oldCookie.setPath("/"); // 쿠키 경로 설정
                response.addCookie(oldCookie); // 변경된 쿠키를 클라이언트에 추가
            }
        } else {
            // 쿠키가 없다면 새로운 쿠키 생성 후 조회수 증가
            updateHits(postPkNum);
            Cookie newCookie = new Cookie("postView", "[" + postPkNum + "]");
            newCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효 기간 1일
            newCookie.setPath("/"); // 쿠키 경로 설정
            response.addCookie(newCookie); // 새로운 쿠키를 클라이언트에 추가
        }

        // 게시글 정보 조회 후 DTO 반환
        Optional<PostEntity> postEntityOptional = frepository.findById(postPkNum);
        if (postEntityOptional.isPresent()) {
            PostEntity postEntity = postEntityOptional.get();
            return PostDto.fromEntity(postEntity); // DTO로 변환하여 반환
        } else {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
    }

	// 조회수 증가 메소드
    @Transactional
    public int updateHits(Integer postPkNum) {
        return frepository.incrementView(postPkNum); // 해당 게시글의 조회수를 증가시키는 메소드
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

	// 페이징, 정렬, 검색
	public Page<PostDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText) {
	    // 정렬 정보 생성
	    Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);

	    // Pageable 객체 생성 (페이지와 정렬 정보 포함)
	    Pageable pageable = PageRequest.of(page, pageSize, sort);
	    
	    // Repository를 통해 데이터를 조회
    	Page<PostEntity> postPage = Page.empty();
    	
    	if (searchType.equalsIgnoreCase("post_name")) {
    		postPage = frepository.findByPostNameContains(searchText, pageable);
    	} else if(searchType.equalsIgnoreCase("user_name")) {
    		postPage = frepository.findByUserEntity_UserNameContains(searchText, pageable);
    	} else {
    		postPage = frepository.findAll(pageable);
    	}
	    // PostEntity -> PostDto 변환
	    return postPage.map(PostDto::fromEntity);
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
