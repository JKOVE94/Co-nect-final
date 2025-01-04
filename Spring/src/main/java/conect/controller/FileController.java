package conect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import conect.data.dto.FileDto;
import conect.data.entity.FileEntity;
import conect.data.entity.UserEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.FileForm;
import conect.data.repository.FileRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;
import conect.service.board.file.FileService;
import conect.service.board.wiki.WikiService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("{compNum}/file/{projNum}")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private WikiService wikiService;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private WikiRepository wikiRepository;

    // 모든 게시글 조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> getFilesByProjectNumber(
        @PathVariable("compNum") Integer compNum,
        @PathVariable("projNum") Integer projNum,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "pageBlock", defaultValue = "0") int pageBlock,
        @RequestParam(name = "sortField", defaultValue = "wikiEntity.wikiRegdate") String sortField,
        @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection,
        @RequestParam(name = "searchType", defaultValue = "") String searchType,
        @RequestParam(name = "searchText", defaultValue = "") String searchText
    ) {
        try {
            int pageSize = 10;
            int blockSize = 5;

            Page<FileDto> postPage = fileService.getList(compNum, projNum, page, pageSize, sortField, sortDirection, searchType, searchText);

            int totalPages = postPage.getTotalPages();
            int totalBlocks = (int) Math.ceil((double) totalPages / blockSize);
            int blockStart = pageBlock * blockSize;
            int blockEnd = Math.min(blockStart + blockSize, totalPages);

            boolean hasPreviousBlock = pageBlock > 0;
            boolean hasNextBlock = pageBlock < totalBlocks - 1;

            Map<String, Object> response = new HashMap<>();
            response.put("files", postPage.getContent());
            response.put("currentPage", postPage.getNumber());
            response.put("totalItems", postPage.getTotalElements());
            response.put("totalPages", totalPages);
            response.put("currentBlock", pageBlock);
            response.put("totalBlocks", totalBlocks);
            response.put("blockStart", blockStart);
            response.put("blockEnd", blockEnd - 1);
            response.put("hasPreviousBlock", hasPreviousBlock);
            response.put("hasNextBlock", hasNextBlock);
            response.put("projNum", projNum);

            return ResponseEntity.ok(response);
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
    public ResponseEntity<FileDto> getPost(
            @PathVariable("compNum") Integer compNum,
            @PathVariable("projNum") Integer projNum,
            @PathVariable("filePkNum") Integer filePkNum,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            FileDto fileDto = fileService.getPostView(filePkNum, request, response);
            return ResponseEntity.ok(fileDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 게시글 생성
    @PostMapping
    @Transactional // 트랜잭션 처리
    public ResponseEntity<Object> createPostWithFile(
            @PathVariable("compNum") Integer compNum,
            @PathVariable("projNum") Integer projNum,
            @RequestParam("file") MultipartFile file,
            @RequestParam("wiki_title") String wikiTitle,
            @RequestParam("wiki_content") String wikiContent,
            @RequestParam("wiki_fk_user_num") Integer userNum,
            @RequestParam("wiki_isnotice") boolean wikiNotice
    ) {
        try {
            // 파일 검증 로직
            long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일이 비어 있습니다.");
            }
            if (file.getSize() > maxFileSize) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("파일 크기가 10MB를 초과합니다.");
            }
            
            // 파일 유형 지정
            // 허용된 파일 확장자 목록
            String[] allowedExtensions = {"png", "jpg", "jpeg", "xlsx", "xls", "hwp", "doc", "docx", "pdf", "zip"};
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일 이름을 확인할 수 없습니다.");
            }

            // 파일 확장자 추출
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1).toLowerCase();
            boolean isAllowedExtension = java.util.Arrays.stream(allowedExtensions).anyMatch(fileExtension::equals);

            if (!isAllowedExtension) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("허용되지 않는 파일 형식입니다. 허용된 파일 형식: " + String.join(", ", allowedExtensions));
            }

            // WikiEntity 생성
            int wikiPkNum = wikiService.addWikiEntity(wikiTitle, wikiContent, userNum, projNum, wikiNotice);
            WikiEntity wikiEntity = wikiRepository.findById(wikiPkNum)
                    .orElseThrow(() -> new RuntimeException("WikiEntity를 찾을 수 없습니다."));

            // FileForm 객체 생성 및 파일 저장 로직
            FileForm fileForm = new FileForm();
            fileForm.setFile(file);
            fileForm.setFile_name(file.getOriginalFilename());
            fileForm.setFile_size((int) file.getSize());
            fileForm.setFile_type(file.getContentType());
            fileForm.setWikiEntity(wikiRepository.findById(wikiPkNum).get()); // 연관된 WikiEntity 설정


            // 파일 저장 후 FileEntity 저장
            FileEntity savedFile = fileService.insertPost(file, fileForm); // 트랜잭션 처리 후 FileEntity 저장

            if (savedFile == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedFile.getFilePkNum()); // 생성된 게시물 PK 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    // 게시글 수정
    @PutMapping("/{filePkNum}")
    @Transactional
    public ResponseEntity<Object> updatePost(
            @PathVariable("compNum") Integer compNum,
            @PathVariable("projNum") Integer projNum,
            @PathVariable("filePkNum") int filePkNum,
            @RequestParam(value = "file", required = false) MultipartFile file, // 파일은 선택적
            @RequestParam("wiki_title") String wikiTitle,
            @RequestParam("wiki_content") String wikiContent,
            @RequestParam("wiki_isnotice") boolean wikiIsnotice
    ) {
        try {
            // 서비스 호출로 수정 로직 처리
            FileDto updatedFile = fileService.updatePost(filePkNum, file, wikiTitle, wikiContent, wikiIsnotice);

            // 반환된 데이터가 null인 경우 (파일 또는 게시글 없음)
            if (updatedFile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수정 대상 게시글이 존재하지 않습니다.");
            }

            return ResponseEntity.ok(updatedFile); // 수정된 데이터 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 중 오류가 발생했습니다.");
        }
    }

    // 게시글 삭제
    @DeleteMapping("/{filePkNum}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable("compNum") Integer compNum,
            @PathVariable("projNum") Integer projNum,
            @PathVariable("filePkNum") int filePkNum) {
        System.out.println("삭제 요청 도달, 파일 PK: " + filePkNum);

        // 데이터 존재 여부 확인
        if (!fileRepository.existsById(filePkNum)) {
            System.out.println("삭제 대상이 존재하지 않습니다: " + filePkNum);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        System.out.println("삭제 대상이 확인되었습니다: " + filePkNum);

        try {
            // 삭제 로직 호출
            fileService.deletePost(filePkNum);
            System.out.println("삭제 완료, 파일 PK: " + filePkNum);
            return ResponseEntity.noContent().build(); // 성공적으로 삭제됨
        } catch (Exception e) {
            System.out.println("삭제 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download/{filePkNum}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable("compNum") Integer compNum,
            @PathVariable("projNum") Integer projNum,
            @PathVariable("filePkNum") int filePkNum) {
        try {
            // 파일 엔티티 조회
            FileEntity fileEntity = fileRepository.findById(filePkNum)
                    .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

            // 파일 경로 확인
            String filePath = fileEntity.getFilePath();
            System.out.println("다운로드 요청 파일 경로: " + filePath);

            Resource resource;
            if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
                String[] urlParts = filePath.split("/");
                String fileName = urlParts[urlParts.length - 1];
                String basePath = filePath.replace(fileName, "");
                String encodedFileName = java.net.URLEncoder.encode(fileName, "UTF-8").replace("+", "%20");

                String encodedFilePath = basePath + encodedFileName;
                System.out.println("인코딩된 파일 경로: " + encodedFilePath);

                resource = new UrlResource(encodedFilePath);
            } else {
                Path path = Paths.get(filePath).toAbsolutePath().normalize();
                resource = new UrlResource(path.toUri());
            }



            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("파일을 읽을 수 없습니다: " + filePath);
            }

            // 파일 이름 처리 (브라우저 호환성)
            String encodedFileName = java.net.URLEncoder.encode(fileEntity.getFileName(), "UTF-8")
                    .replace("+", "%20");

            // Content-Disposition 헤더로 파일 다운로드 처리
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
            
        } catch (Exception e) {
            System.err.println("파일 다운로드 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}