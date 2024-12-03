package conect.controller;

import conect.data.dto.PostDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.service.board.post.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private PostService postService;

	// 게시글 생성
	@PostMapping("/free")
	public Map<String, Object> createPost(@RequestBody PostForm postForm) {
		postService.insertPost(postForm);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("isSuccess", true);
		
		return map;
	}

	// 모든 게시글 조회
	@GetMapping("/free")
	public ResponseEntity<List<PostDto>> getAllPosts() {
	    try {
	        List<PostDto> posts = postService.getPostAll();
	        System.out.println("조회된 게시글: " + posts); // 로그 추가
	        return new ResponseEntity<>(posts, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
}