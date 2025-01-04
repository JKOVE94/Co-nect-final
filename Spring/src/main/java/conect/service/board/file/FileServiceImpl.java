package conect.service.board.file;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import conect.data.dto.FileDto;
import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.FileForm;
import conect.data.repository.FileRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private WikiRepository wikiRepository;

    // GCP Storage 세팅
    @Value("${spring.cloud.gcp.storage.credentials.location}")
    private String keyFileName;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // 파일 저장
    @Override
    public String saveFile(FileForm form, MultipartFile file) throws IOException {
        InputStream keyFile = null;
        String fileUrl = "";

        try {
            keyFile = ResourceUtils.getURL(keyFileName).openStream();

            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = "file/" + UUID.randomUUID().toString() + "_" + originalFileName;

            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(keyFile))
                    .build()
                    .getService();

            // BlobInfo 생성 (파일 정보)
            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, uniqueFileName).build();

            // Google Cloud Storage에 파일 업로드
            storage.create(blobInfo, file.getBytes());

            fileUrl = "https://storage.googleapis.com/" + bucketName + "/" + uniqueFileName;

        } finally {
            if (keyFile != null) {
                keyFile.close();
            }
        }
        System.out.println(fileUrl);

        return fileUrl;
    }

    // WikiEntity 저장 (트랜잭션 처리)
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public FileEntity insertPost(MultipartFile file, FileForm fileForm) throws IOException {
        try {
            // 1. 파일 URL 받기
            String fileUrl = saveFile(fileForm, file);

            // 2. FileEntity 객체 생성
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFilePath(fileUrl);
            fileEntity.setFileType(file.getContentType());
            fileEntity.setFileSize((int) file.getSize());

            // WikiEntity와 연결
            WikiEntity wikiEntity = fileForm.getWikiEntity();
            if (wikiEntity != null) {
                fileEntity.setWikiEntity(wikiEntity);
            }

            // 4. FileEntity 저장
            fileRepository.save(fileEntity);
            return fileEntity;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("파일 처리 중 오류 발생", e);  // 예외를 던져서 롤백을 트리거함
        }
    }

    // 전체 조회
    @Override
    public List<FileDto> getPostAll() {
        return fileRepository.findAll()
                .stream()
                .map(FileDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 부분 조회 (조회수 증가 포함)
    @Override
    public FileDto getPostView(Integer filePkNum, HttpServletRequest request, HttpServletResponse response) {
        // 세션에서 조회 기록 확인
        HttpSession session = request.getSession();
        String sessionKey = "viewedPost_" + filePkNum;
        Boolean hasViewedInSession = (Boolean) session.getAttribute(sessionKey);

        // 쿠키 확인
        Cookie[] cookies = request.getCookies();
        boolean hasViewedInCookie = false; // 게시물 확인 여부

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("viewedPost_" + filePkNum)) {
                    hasViewedInCookie  = true;
                    break;
                }
            }
        }

        // 조회수 증가
        // 조회수 확인되었을 때 실행되는 로직
        if ((hasViewedInSession == null || !hasViewedInSession) && !hasViewedInCookie) {
            incrementViewCount(filePkNum);

            // 세션에 조회 기록 저장
            session.setAttribute(sessionKey, true);

            // 새로운 쿠키 생성
            Cookie newCookie = new Cookie("viewedPost_" + filePkNum, "true");
            // 쿠키 이름 : 확인된게시물_게시물PkNum => 특정 파일을 사용자가 조회했는지 쿠키로 저장합니다. 
            // 해당 게시물을 1일 이내 다시 조회하면 저장된 쿠키를 확인하고 조회수 증가 X
            newCookie.setMaxAge(86400); // 쿠키 유효 기간 : 1일
            newCookie.setHttpOnly(true);
            newCookie.setPath("/"); // 모든 경로에서 쿠키 유효
            response.addCookie(newCookie);
        }

        // 부분 조회 로직
        FileEntity fileEntity = fileRepository.findById(filePkNum)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        FileDto fileDto = FileDto.fromEntity(fileEntity);

        return fileDto;
    }

    // 조회수 증가 로직
    @Transactional
    public void incrementViewCount(Integer filePkNum) {
        FileEntity fileEntity = fileRepository.findById(filePkNum) // FileEntity에서 Pk 값 가져옴
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        WikiEntity wikiEntity = fileEntity.getWikiEntity(); // FileEntity에서 WikiEntity 정보 가져옴

        if (wikiEntity != null) { // wikiEntity가 비어있지 않을 때 조회수 증가
            wikiEntity.setWikiView(wikiEntity.getWikiView() + 1);
            wikiRepository.save(wikiEntity);
        }
    }

    // 수정
    @Override
    @Transactional
    public FileDto updatePost(int filePkNum, MultipartFile file, String wikiTitle, String wikiContent, boolean wikiIsnotice) {
        // 수정 대상 파일 조회
        FileEntity fileEntity = fileRepository.findById(filePkNum)
                .orElseThrow(() -> new RuntimeException("수정 대상 파일이 존재하지 않습니다."));

        try {
            // 파일 수정 처리
            if (file != null && !file.isEmpty()) {
                String fileUrl = saveFile(new FileForm(), file);
                fileEntity.setFileName(file.getOriginalFilename());
                fileEntity.setFilePath(fileUrl);
                fileEntity.setFileType(file.getContentType());
                fileEntity.setFileSize((int) file.getSize());
            }

            // WikiEntity 수정
            WikiEntity wikiEntity = fileEntity.getWikiEntity();
            if (wikiEntity != null) {
                wikiEntity.setWikiTitle(wikiTitle);
                wikiEntity.setWikiContent(wikiContent);
                wikiEntity.setWikiIsnotice(wikiIsnotice);
                wikiRepository.save(wikiEntity); // 연관된 WikiEntity 저장
            }

            // FileEntity 저장
            fileRepository.save(fileEntity);

            // 수정된 데이터를 반환
            return FileDto.fromEntity(fileEntity);

        } catch (IOException e) {
            throw new RuntimeException("파일 수정 중 오류가 발생했습니다.", e);
        }
    }


    // 삭제
    @Override
    public void deletePost(int filePkNum) {
        // 파일 정보 가져오기
        FileEntity fileEntity = fileRepository.findById(filePkNum)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다. ID: " + filePkNum));

        System.out.println("삭제하려는 파일 정보: " + fileEntity);

        // GCS에서 파일 삭제
        deleteFileFromGCS(fileEntity.getFilePath());

        // DB에서 파일 삭제
        fileRepository.deleteById(filePkNum);
    }

    private void deleteFileFromGCS(String filePath) {
        System.out.println("삭제하려는 파일 경로: " + filePath);
        try {
            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(ResourceUtils.getURL(keyFileName).openStream()))
                    .build()
                    .getService();

            Blob blob = storage.get(bucketName, filePath);
            if (blob != null) {
                blob.delete();
                System.out.println("파일 삭제 성공: " + filePath);
            } else {
                System.out.println("파일이 존재하지 않음: " + filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Google Cloud Storage에서 파일 삭제 실패: " + e.getMessage());
        }
    }


    // 페이징, 검색, 공지 여부 정렬 추가
    public Page<FileDto> getList(Integer compNum, Integer projNum, int page, int pageSize, String sortField, String sortDirection,String searchType, String searchText) {
        // 공지사항 여부를 우선 정렬하고, 사용자 지정 정렬 조건 추가
        Sort sort = Sort.by(Sort.Order.desc("wikiEntity.wikiIsnotice")) // 공지사항을 상단에 정렬
                .and(Sort.by(Sort.Direction.fromString(sortDirection), sortField)); // 사용자 지정 정렬


        // 디버깅 로그로 확인
        System.out.println("생성된 정렬 조건: " + sort);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Repository를 통해 데이터를 조회
        Page<FileEntity> filePage;

        if ("file_name".equalsIgnoreCase(searchType)) {
            // 파일명 검색
            filePage = fileRepository.findByFileNameContains(searchText, projNum, pageable);
        } else if ("user_name".equalsIgnoreCase(searchType)) {
            // 작성자명 검색
            filePage = fileRepository.findByWikiEntity_UserEntity_UserNameContains(searchText, projNum, pageable);
        } else {
            // 전체 조회
            filePage = fileRepository.findByWikiEntity_ProjectEntity_ProjPkNum(projNum, pageable);
        }

        // FileEntity -> FileDto 변환
        return filePage.map(FileDto::fromEntity);
    }

}