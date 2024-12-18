package conect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.FileDto;
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
    public ResponseEntity<Map<String, Object>> getAllPosts() {
        try {
            // 모든 게시글 목록 조회
            Map<String, Object> response = new HashMap<>();
            response.put("files", fileService.getPostAll()); // 게시글 데이터
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
    @PostMapping("/")
    public ResponseEntity<Integer> createPostWithFile(
        @ModelAttribute FileForm fileForm, // 게시물 데이터
        @RequestParam(value = "file_fk_wiki_num", required = false, defaultValue = "0") Integer fileFkWikiNum, // 기본값 설정
        @RequestParam("file") MultipartFile file // 업로드된 파일
    ) {
        try {
        	// file_fk_wiki_num이 null일 경우 기본값을 설정
            if (fileFkWikiNum == null) {
                fileFkWikiNum = 0; // 기본값 설정
            }
        	
            // 파일 검증 로직
            long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.getSize() > maxFileSize) {
                return new ResponseEntity<>(HttpStatus.PAYLOAD_TOO_LARGE); // 파일 크기 초과
            }

            // 파일 저장 로직
            String filePath = fileService.saveFile(fileForm, file); // 파일 저장 서비스 호출
            fileForm.setFile_path(filePath); // 저장된 파일 경로를 폼에 설정

            // 게시물 저장
            FileEntity entity = fileService.insertPost(file, fileForm); // 게시물 저장 서비스 호출

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
