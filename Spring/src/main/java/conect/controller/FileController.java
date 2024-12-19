package conect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.FileDto;
import conect.data.dto.PostDto;
import conect.data.entity.FileEntity;
import conect.data.form.FileForm;
import conect.service.board.file.FileService;

import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    // 모든 게시글 조회
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAllPosts(
    		@RequestParam(name = "page", defaultValue = "0") int page, // 현재 페이지 번호
    	    @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock, // 현재 블록 번호
    	    @RequestParam(name = "searchType", defaultValue = "") String searchType, // 검색분류
    	    @RequestParam(name = "searchText", defaultValue = "") String searchText // 검색어
    	) {
        try {
        	int pageSize = 10; // 한 페이지당 항목 수
	        int blockSize = 5; // 한 블록당 페이지 버튼 수

	        // 페이징 및 정렬 서비스 호출
	        Page<FileDto> postPage = fileService.getList(page, pageSize, searchType, searchText);

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
            // 모든 게시글 목록 조회
            Map<String, Object> response = new HashMap<>();
            response.put("files", fileService.getPostAll()); // 게시글 데이터
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
            
            return new ResponseEntity<>(response, HttpStatus.OK); // 성공 시 200 응답 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "서버 오류 발생",
                "details", e.getMessage()
            ));
        }
    }

    // 특정 게시글 조회
    @GetMapping("/{filePkNum}")
    public ResponseEntity<FileDto> getPost(@PathVariable("filePkNum") Integer filePkNum) {
        try {
            // 게시글 조회
            FileDto fileDto = fileService.getPostView(filePkNum);
            return new ResponseEntity<>(fileDto, HttpStatus.OK); // 성공 시 게시글 데이터 반환
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 게시글 미존재 시 404 응답 반환
        }
    }

    // 게시글 생성
    @PostMapping
    public ResponseEntity<Integer> createPostWithFile(
        @RequestBody FileForm fileForm // 게시물 데이터
    ) {
        try {
        	// file_fk_wiki_num이 null일 경우 기본값을 설정
            if (fileForm.getFile_fk_wiki_num() == null) {
            	fileForm.setFile_fk_wiki_num(0); // 기본값 설정
            }
        	
            // 파일 검증 로직
            long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (fileForm.getFile().getSize() > maxFileSize) {
                return new ResponseEntity<>(HttpStatus.PAYLOAD_TOO_LARGE); // 파일 크기 초과
            }

            // 파일 저장 로직
            String filePath = fileService.saveFile(fileForm, fileForm.getFile()); // 파일 저장 서비스 호출
            fileForm.setFile_path(filePath); // 저장된 파일 경로를 폼에 설정
            System.out.println("fileForm : "+fileForm);
            // 게시물 저장
            FileEntity entity = fileService.insertPost(fileForm.getFile(), fileForm); // 게시물 저장 서비스 호출

            if (entity == null) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 파일 저장 실패 시
            }

            return new ResponseEntity<>(entity.getFilePkNum(), HttpStatus.CREATED); // 생성된 게시물 PK 반환
        } catch (RuntimeException e) {
            // RuntimeException은 데이터 처리 과정에서 발생할 수 있는 예외 처리
            e.printStackTrace(); // 오류 로그 출력
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 잘못된 요청 시
        } catch (Exception e) {
            // 일반적인 예외 처리
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
