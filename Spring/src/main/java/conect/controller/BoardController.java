package conect.controller;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.data.repository.UserRepository;
import conect.service.board.post.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private PostService postService;
	
	@Autowired
	private UserRepository userRepository;

	// 게시글 생성
	@PostMapping("/free")
	public int createPost(@RequestBody PostForm postForm) {
		
		try {
		PostEntity entity = postService.insertPost(postForm);
		return entity.getPostPkNum();
		}catch(Exception e) {
			System.out.println("Insert err :"+e );
		}
		return 0;
	}

	// 모든 게시글 조회
		@GetMapping("/free")
		public ResponseEntity<Map<String, Object>> getAllPosts(
		    @RequestParam(name = "page", defaultValue = "0") int page,
		    @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock // 블록 번호 추가
		) {
		    try {
		        // 한 페이지당 5개씩 페이지 버튼을 표시
		        int pageSize = 5;

		        // 페이지 요청 처리 (블록당 5개의 페이지로 나누기)
		        Page<PostDto> postPage = postService.getList(page, pageSize);

		        // 전체 페이지 수를 계산 (블록 기준으로)
		        int totalPages = postPage.getTotalPages();
		        int totalBlocks = (int) Math.ceil((double) totalPages / pageSize); // 총 블록 수

		        // 응답 객체 구성
		        Map<String, Object> response = new HashMap<>();
		        response.put("posts", postPage.getContent()); // 게시글 내용
		        response.put("currentPage", postPage.getNumber()); // 현재 페이지
		        response.put("totalItems", postPage.getTotalElements()); // 전체 게시글 수
		        response.put("totalPages", totalPages); // 전체 페이지 수
		        response.put("totalBlocks", totalBlocks); // 전체 블록 수
		        response.put("currentBlock", pageBlock); // 현재 블록 번호

		        // 페이징 정보 포함된 응답 반환
		        return new ResponseEntity<>(response, HttpStatus.OK);
		    } catch (Exception e) {
		        e.printStackTrace();
		        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생 시
		    }
		}

	// 부분 게시글 조회
	@GetMapping("/free/{postPkNum}")
	public ResponseEntity<PostDto> getPost(@PathVariable("postPkNum") int postPkNum) {
		try {
			PostDto post = postService.getPost(postPkNum);
			return new ResponseEntity<>(post, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 게시글 수정
	@PutMapping("/free/{postPkNum}")
	public ResponseEntity<PostDto> updatePost(@PathVariable("postPkNum") int postPkNum,
			@RequestBody PostForm postForm) {
		try {
			PostDto updatedPost = postService.updatePost(postPkNum, postForm);
			if (updatedPost != null) {
				return new ResponseEntity<>(updatedPost, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 게시글 삭제
	@DeleteMapping("/free/{postPkNum}")
	public ResponseEntity<Void> deletePost(@PathVariable("postPkNum") int postPkNum) {
		try {
			postService.deletePost(postPkNum);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/free/username/{namelist}")
	public List<Map<Integer, String>> getUserName(@PathVariable("namelist") String userNumsString) {
		System.out.println(userNumsString);
		StringTokenizer st = new StringTokenizer(userNumsString,","); // nums String으로 관리하고, 구분자가 ',' 그래서 ,를 기준으로 스트링토크나이저 사용해서 각각의 토큰화
		List<Integer> userNums = new ArrayList<Integer>(); // 그 토큰을 INTEGER화 해서 담을 LIST => 순서가 필요없고 갯수가 정해져 있지 않아서 array X List O
		while(st.hasMoreTokens()) {// 토큰이 있을경우
			userNums.add(Integer.parseInt(st.nextToken())); // 다음 토큰을 찾아 이동하면서 해당 토큰(String) => parseInt => userNums라는 List<Integer>에 담아주고
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