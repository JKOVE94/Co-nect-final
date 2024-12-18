package conect.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.FileDto;
import conect.data.entity.FileEntity;
import conect.data.form.FileForm;
import conect.service.board.file.FileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "*") 
@RestController 
@RequestMapping("/file") 
public class FileController {
	
	@Autowired
	private FileService fileService;

	// 모든 게시글 조회 (페이징, 검색, 정렬 포함)
	@GetMapping("/")
	public ResponseEntity<Map<String, Object>> getAllPosts(
	    @RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
	    @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
	    @RequestParam(name = "sortField", defaultValue = "wikiRegdate") String sortField, // 정렬 필드
	    @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection, // 정렬 방향
	    @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색 분류
	    @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
	) {
		try {
			int pageSize = 10; // 한 페이지당 항목 수
			int blockSize = 5; // 한 블록당 페이지 버튼 수

			// 페이징 및 정렬 데이터를 포함한 게시글 목록 조회
			Page<FileDto> postPage = fileService.getList(page, pageSize, sortField, sortDirection, searchType, searchText);

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
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				    "message", "서버 오류 발생",
				    "details", e.getMessage()
				));		}
	}

	// 특정 게시글 조회
	@GetMapping("/{filePkNum}")
	public ResponseEntity<FileDto> getPost(
	    @PathVariable("filePkNum") Integer filePkNum) {
		// 요청 정보와 함께 서비스 호출
		try {
	        FileDto fileDto = fileService.getPostView(filePkNum);
	        return new ResponseEntity<>(fileDto, HttpStatus.OK); // 성공 시 게시글 데이터 반환
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글 미존재 시 404 응답 반환
	    }
	}

	// 게시글 생성
	@PostMapping("/")
	public ResponseEntity<Integer> createPostWithFile(
	    @ModelAttribute FileForm fileForm, // 게시물 데이터
	    @RequestParam("file") MultipartFile file // 업로드된 파일
	) {
	    try {
	        // 파일 검증 로직
	        long maxFileSize = 10 * 1024 * 1024; // 10MB
	        if (file.getSize() > maxFileSize) {
	            return new ResponseEntity<>(HttpStatus.PAYLOAD_TOO_LARGE); // 파일 크기 초과
	        }

	        // 파일 저장 로직 (예: 파일 경로 설정 및 실제 저장)
	        String filePath = fileService.saveFile(fileForm, file); // 파일 저장 서비스 호출
	        fileForm.setFile_path(filePath); // 저장된 파일 경로를 폼에 설정

	        // 게시물 저장
	        FileEntity entity = fileService.insertPost(file, fileForm); // 게시물 저장 서비스 호출
	        return new ResponseEntity<>(entity.getFilePkNum(), HttpStatus.CREATED); // 생성된 게시물 PK 반환
	    } catch (Exception e) {
	        e.printStackTrace(); // 오류 로그 출력
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 서버 오류
	    }
	}

	
	// 게시글 수정
	@PutMapping("/{filePkNum}")
	public ResponseEntity<FileDto> updatePost(
	    @PathVariable("filePkNum") int filePkNum, // 수정할 게시글 번호
	    @RequestBody FileForm fileForm // 수정할 데이터
	) {
		try {
			FileDto updatedPost = fileService.updatePost(filePkNum, fileForm); // 게시글 수정 호출
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
	@DeleteMapping("/{filePkNum}")
	public ResponseEntity<Void> deleteFile(@PathVariable("filePkNum") int filePkNum) {
		try {
			fileService.deletePost(filePkNum); // 게시글 삭제 호출
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 성공 시 204 응답 반환
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글 미존재 시 404 응답 반환
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 오류 시 500 응답 반환
		}
	}
}
