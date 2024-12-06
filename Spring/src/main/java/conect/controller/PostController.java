package conect.controller;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.service.board.post.PostService;
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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/board")
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
//-----------------------------------------------------------------------------------------------
//    // 임시 저장된 게시글 생성
//    @PostMapping("/temporary")
//    public TemporaryDto saveTemporary(@RequestBody PostForm postForm) {
//        return TemporaryDto.fromEntity(tempService.saveTemporary(postForm));
//    }
//
//    // 임시 저장된 게시글 목록 조회
//    @GetMapping("/temporary")
//    public List<TemporaryDto> getAllTemporary() {
//        return tempService.getAllTemporary();
//    }
//
//    // 임시 저장된 게시글 삭제
//    @DeleteMapping("/temporary/{postPkNum}")
//    public void deleteTemporary(@PathVariable int postPkNum) {
//    	tempService.deleteTemporary(postPkNum);
//    }
