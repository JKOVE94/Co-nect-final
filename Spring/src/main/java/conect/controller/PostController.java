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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("{comp_pk_num}/board")
public class PostController {

	@Autowired
	private PostService postService;

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
	    @RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
	    @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
	    @RequestParam(name = "sortField", defaultValue = "postRegdate") String sortField, // 정렬 필드
	    @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection, // 정렬 방향
	    @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색분류
	    @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
	) {
	    try {
	        int pageSize = 10; // 한 페이지당 항목 수
	        int blockSize = 5; // 한 블록당 페이지 버튼 수

	        // 페이징 및 정렬 서비스 호출
	        Page<PostDto> postPage = postService.getList(page, pageSize, sortField, sortDirection, searchType, searchText);

	        // 총 페이지 수
	        int totalPages = postPage.getTotalPages();

	        // 전체 블록 수
	        int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);

	        // 현재 블록의 시작 및 끝 페이지 번호 계산
	        int blockStart = pageBlock * blockSize; // 블록 시작 페이지
	        int blockEnd = Math.min(blockStart + blockSize, totalPages); // 블록 끝 페이지

	        // 이전 블록 및 다음 블록 존재 여부
	        boolean hasPreviousBlock = pageBlock > 0;
	        boolean hasNextBlock = pageBlock < totalBlocks - 1;

	        // 응답 객체 구성
	        Map<String, Object> response = new HashMap<>();
	        // 페이징 제공 메서드 사용
	        response.put("posts", postPage.getContent()); // 게시글 데이터 불러오기
	        response.put("currentPage", postPage.getNumber()); // 현재 페이지 번호
	        response.put("totalItems", postPage.getTotalElements()); // 전체 게시글 수
	        // 페이지 당 블럭 설정
	        response.put("totalPages", totalPages); // 전체 페이지 수
	        response.put("currentBlock", pageBlock); // 현재 블록 번호
	        response.put("totalBlocks", totalBlocks); // 총 블록 수
	        response.put("blockStart", blockStart); // 현재 블록 시작 페이지 번호
	        response.put("blockEnd", blockEnd - 1); // 현재 블록 끝 페이지 번호
	        response.put("hasPreviousBlock", hasPreviousBlock); // 이전 블록 존재 여부
	        response.put("hasNextBlock", hasNextBlock); // 다음 블록 존재 여부

	        // 상태 코드 200과 함께 응답 반환
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 발생 시
	    }
	}


	// 부분 게시글 조회
    @GetMapping("/free/{postPkNum}")
    public ResponseEntity<PostDto> getPost(@PathVariable("postPkNum") Integer postPkNum, HttpServletRequest request, HttpServletResponse response) {
        PostDto postDto = postService.getPostView(postPkNum, request, response);
        return new ResponseEntity<>(postDto, HttpStatus.OK);
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
}