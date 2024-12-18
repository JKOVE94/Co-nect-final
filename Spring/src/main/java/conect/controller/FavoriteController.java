package conect.controller;

import conect.data.dto.FavoritesDto;
import conect.data.dto.PostDto;
import conect.data.dto.ProjectDto;
import conect.data.dto.TaskDto;
import conect.data.entity.FavoritesEntity;
import conect.data.entity.PostEntity;
import conect.data.form.PostForm;
import conect.data.form.TaskForm;
import conect.service.board.favor.FavorService;
import conect.service.board.post.PostService;
import conect.service.board.proj.ProjService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {

	@Autowired
	private FavorService favorService;

	// 유저가 즐겨찾기 등록한 자유게시글 목록
	@GetMapping("/post/{usernum}")
	public ResponseEntity<Object> getAllFavoritePost(@PathVariable("usernum") int usernum,
													@RequestParam(name="page", defaultValue = "0") int page,
													@RequestParam(name="size", defaultValue = "10") int size) {
		try {
			Page<Object> favorList = favorService.getFavoritePost(usernum, page, size);
			return ResponseEntity.ok(favorList);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (ConfigDataResourceNotFoundException e) { /// 즐겨찾기 목록이 없는 경우
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource Not Found");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}

	// 유저가 즐겨찾기 등록한 프로젝트 목록
	@GetMapping("/proj/{usernum}")
	public ResponseEntity<Object> getAllFavoriteProj(@PathVariable("usernum") int usernum,
													@RequestParam(name="page", defaultValue = "0") int page,
													@RequestParam(name="size", defaultValue = "10") int size) {

		try {
			Page<Object> favorList = favorService.getFavoriteProj(usernum, page, size);
			return ResponseEntity.ok(favorList);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (ConfigDataResourceNotFoundException e) { /// 즐겨찾기 목록이 없는 경우
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource Not Found");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}

	// 즐겨찾기에 등록되어있는지 확인
	// type : 자유게시글(post)/프로젝트(proj), usernum : 유저번호, pknum : 글 번호
	@GetMapping("/{type}/{usernum}/{pknum}")
	public ResponseEntity<Object> checkFavorite(@PathVariable("type") String type,
			@PathVariable("usernum") int usernum,
			@PathVariable("pknum") int num) {
		try {
			if (!favorService.checkFavorite(type, usernum, num).isEmpty()) {
				return ResponseEntity.ok(true); // 등록되어 있을 경우 true 반환
			} else {
				return ResponseEntity.ok(false);// 등록되어있지 않을 경우 false 반환
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}

	// 즐겨찾기 등록
	// type : 자유게시글(post)/프로젝트(proj)
	@PostMapping("/{type}")
	public ResponseEntity<Object> addFavorite(@RequestBody FavoritesDto dto, @PathVariable("type") String type) {
		try {
			if (favorService.addFavoriteData(dto, type)) {
				return ResponseEntity.ok(true); // 등록 성공
			} else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(false); // 이미 등록된 즐겨찾기 or 비즈니스 로직 위반
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}

	}

	// 즐겨찾기 삭제
	@DeleteMapping("/{pknum}")
	public ResponseEntity<Object> dropFavorite(@PathVariable("pknum") int pknum) {
		try {
			if (favorService.dropFavoriteData(pknum)) {
				return ResponseEntity.ok(true); // 삭제 성공
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource Not Found"); // 즐겨찾기를 찾을 수 없는 경우
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}

	// 즐겨찾기 삭제 (post, proj pk num 전달 시)
	@DeleteMapping("/{type}/{usernum}/{pknum}")
	public ResponseEntity<Object> dropFavoriteAsPk(@PathVariable("type") String type,
			@PathVariable("usernum") int usernum, @PathVariable("pknum") int pkum) {
		try {
			if (favorService.dropFavoriteDataAsPk(type, usernum, pkum)) {
				return ResponseEntity.ok(true); // 삭제 성공
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource Not Found"); // 즐겨찾기를 찾을 수 없는 경우
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters"); // 잘못된 요청이 들어온 경우
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server Error");
		}
	}
}
