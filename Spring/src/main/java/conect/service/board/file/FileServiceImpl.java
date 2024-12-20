package conect.service.board.file;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
import conect.data.dto.PostDto;
import conect.data.entity.FileEntity;
import conect.data.entity.PostEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.FileForm;
import conect.data.repository.FileRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private WikiRepository wikiRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;

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
            // fileRepository.flush();  // 즉시 DB에 반영
            return fileEntity; // 반환

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

    // 부분 조회
    @Override
    public FileDto getPostView(Integer filePkNum) {
        FileEntity fileEntity = fileRepository.findById(filePkNum)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다"));

        FileDto fileDto = FileDto.fromEntity(fileEntity);

        if (fileEntity.getWikiEntity() != null) {
            WikiEntity wikiEntity = fileEntity.getWikiEntity();
            fileDto.setWiki_regdate(wikiEntity.getWikiRegdate());
            fileDto.setWiki_view(wikiEntity.getWikiView());
            if (wikiEntity.getUserEntity() != null) {
                fileDto.setUser_name(wikiEntity.getUserEntity().getUserName());
            }
        }

        return fileDto;
    }

    // 수정
    @Override
    @Transactional
    public FileDto updatePost(int filePkNum, MultipartFile file, String wikiTitle, String wikiContent) {
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

    
    // 페이징, 검색
 	public Page<FileDto> getList(int page, int pageSize, String searchType, String searchText) {
 	   

 	    // Pageable 객체 생성 (페이지와 정렬 정보 포함)
 	    Pageable pageable = PageRequest.of(page, pageSize);
 	    
 	    // Repository를 통해 데이터를 조회
     	Page<FileEntity> filePage = Page.empty();
     	
     	if (searchType.equalsIgnoreCase("file_name")) {
     		filePage = fileRepository.findByFileNameContains(searchText, pageable);
     	}  else {
     		filePage = fileRepository.findAll(pageable);
     	}
 	    // PostEntity -> PostDto 변환
 	    return filePage.map(FileDto::fromEntity);
 	}
}
