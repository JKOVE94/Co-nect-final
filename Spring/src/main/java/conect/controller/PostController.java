package conect.controller;

import conect.data.dto.PostDto;
//import conect.data.dto.TemporaryDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.service.board.post.PostService;
//import conect.service.board.temporary.TempService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*") // CORS 문제 해결을 위한 어노테이션
@RestController // RESTful 컨트롤러로 동작
@RequestMapping("/board") // 기본 URL 경로 설정
public class PostController {

	@Autowired
	private PostService postService; // 게시글 관련 비즈니스 로직 처리 서비스
	// @Autowired
	// private TempService tempService; // 임시 저장 서비스 (주석 처리)

	// 게시글 생성
	@PostMapping("/free")
	public int createPost(@RequestBody PostForm postForm) {
		// POST 요청으로 전달된 게시글 데이터를 저장
		try {
			PostEntity entity = postService.insertPost(postForm); // 게시글 저장 서비스 호출
			return entity.getPostPkNum(); // 저장된 게시글의 PK 반환
		} catch (Exception e) {
			System.out.println("Insert err :" + e); // 오류 메시지 출력
		}
		return 0; // 실패 시 0 반환
	}

	// 모든 게시글 조회 (페이징, 검색, 정렬 포함)
	@GetMapping("/free")
	public ResponseEntity<Map<String, Object>> getAllPosts(
	    @RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
	    @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
	    @RequestParam(name = "sortField", defaultValue = "postRegdate") String sortField, // 정렬 필드
	    @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection, // 정렬 방향
	    @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색 분류
	    @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
	) {
		try {
			int pageSize = 10; // 한 페이지당 항목 수
			int blockSize = 5; // 한 블록당 페이지 버튼 수

			// 페이징 및 정렬 데이터를 포함한 게시글 목록 조회
			Page<PostDto> postPage = postService.getList(page, pageSize, sortField, sortDirection, searchType, searchText);

			// 총 페이지 수 계산
			int totalPages = postPage.getTotalPages();
			// 전체 블록 수 계산
			int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);

			// 현재 블록의 시작 및 끝 페이지 번호 계산
			int blockStart = pageBlock * blockSize; // 블록 시작 페이지
			int blockEnd = Math.min(blockStart + blockSize, totalPages); // 블록 끝 페이지

			// 이전 및 다음 블록 여부
			boolean hasPreviousBlock = pageBlock > 0;
			boolean hasNextBlock = pageBlock < totalBlocks - 1;

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("posts", postPage.getContent()); // 게시글 데이터
			response.put("currentPage", postPage.getNumber()); // 현재 페이지 번호
			response.put("totalItems", postPage.getTotalElements()); // 총 게시글 수
			response.put("totalPages", totalPages); // 총 페이지 수
			response.put("currentBlock", pageBlock); // 현재 블록 번호
			response.put("totalBlocks", totalBlocks); // 총 블록 수
			response.put("blockStart", blockStart); // 현재 블록 시작 페이지
			response.put("blockEnd", blockEnd - 1); // 현재 블록 끝 페이지
			response.put("hasPreviousBlock", hasPreviousBlock); // 이전 블록 여부
			response.put("hasNextBlock", hasNextBlock); // 다음 블록 여부

			return new ResponseEntity<>(response, HttpStatus.OK); // 성공 시 200 응답 반환
		} catch (Exception e) {
			e.printStackTrace(); // 오류 로그 출력
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 시 500 응답 반환
		}
	}

	// 특정 게시글 조회
	@GetMapping("/free/{postPkNum}")
	public ResponseEntity<PostDto> getPost(
	    @PathVariable("postPkNum") Integer postPkNum, // 경로 변수로 게시글 번호 전달
	    HttpServletRequest request, HttpServletResponse response) {
		// 요청 정보와 함께 서비스 호출
		PostDto postDto = postService.getPostView(postPkNum, request, response);
		return new ResponseEntity<>(postDto, HttpStatus.OK); // 성공 시 게시글 데이터 반환
	}

	// 게시글 수정
	@PutMapping("/free/{postPkNum}")
	public ResponseEntity<PostDto> updatePost(
	    @PathVariable("postPkNum") int postPkNum, // 수정할 게시글 번호
	    @RequestBody PostForm postForm // 수정할 데이터
	) {
		try {
			PostDto updatedPost = postService.updatePost(postPkNum, postForm); // 게시글 수정 호출
			if (updatedPost != null) {
				return new ResponseEntity<>(updatedPost, HttpStatus.OK); // 성공 시 200 응답 반환
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글 미존재 시 404 응답 반환
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 시 500 응답 반환
		}
	}

	// 게시글 삭제
	@DeleteMapping("/free/{postPkNum}")
	public ResponseEntity<Void> deletePost(@PathVariable("postPkNum") int postPkNum) {
		try {
			postService.deletePost(postPkNum); // 게시글 삭제 호출
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 성공 시 204 응답 반환
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글 미존재 시 404 응답 반환
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 시 500 응답 반환
		}
	}
}

// 아래 주석은 임시 저장 관련 메서드로 필요 시 활성화 가능
/*
	// 임시 저장된 게시글 생성
	@PostMapping("/temporary")
	public TemporaryDto saveTemporary(@RequestBody PostForm postForm) {
		return TemporaryDto.fromEntity(tempService.saveTemporary(postForm));
	}

	// 임시 저장된 게시글 목록 조회
	@GetMapping("/temporary")
	public List<TemporaryDto> getAllTemporary() {
		return tempService.getAllTemporary();
	}

	// 임시 저장된 게시글 삭제
	@DeleteMapping("/temporary/{postPkNum}")
	public void deleteTemporary(@PathVariable("postPkNum") int postPkNum) {
		System.out.println("숫자 확인 :" + postPkNum);
		tempService.deleteTemporary(postPkNum);
	}
*/