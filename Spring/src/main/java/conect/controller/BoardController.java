package conect.controller;

import conect.data.dto.FavoritesDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.service.board.favor.FavorService;
import conect.service.board.post.PostService;
import conect.service.board.proj.ProjService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private PostService postService;
	@Autowired
	private ProjService projService;
	@Autowired
	private FavorService favorService;
	
	//즐겨찾기
	//즐겨찾기-자유게시글
	@GetMapping("/favorite/post/{usernum}")
	public List<PostDto> getAllFavoritePost(@PathVariable("usernum")int usernum){
		return favorService.getFavoritePost(usernum);
	}
	//즐겨찾기-프로젝트
	@GetMapping("/favorite/proj/{usernum}")
	public List<ProjectDto> getAllFavoriteProj(@PathVariable("usernum")int usernum){
		return favorService.getFavoriteProj(usernum);
	}
	//즐겨찾기 등록
	@PostMapping("/favorite/{type}")
	public Map<String, Object> addFavorite(@RequestBody FavoritesDto dto, @PathVariable("type")String type){
		if(favorService.addFavoriteData(dto, type)) {
			return Map.of("isSuccess",true);
		} else {
			return Map.of("isSuccess",false);
		}
	}
	
	//즐겨찾기 삭제
	@DeleteMapping("/favorite/{num}")
	public Map<String, Object> dropFavorite(@PathVariable("num")int num){
		if(favorService.dropFavoriteData(num)) {
			return Map.of("isSuccess",true);
		} else {
			return Map.of("isSuccess",false);
		}
	}
	
	
	// 자유게시글
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
	public ResponseEntity<PostEntity> updatePost(@PathVariable("postPkNum") int postPkNum,
			@RequestBody PostForm postForm) {
		try {
			PostEntity updatedPost = postService.updatePost(postPkNum, postForm);
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