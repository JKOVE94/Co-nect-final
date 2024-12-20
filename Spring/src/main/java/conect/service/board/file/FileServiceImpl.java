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
            // 2. 파일 URL 받기
            String fileUrl = saveFile(fileForm, file);

            // 3. FileEntity 객체 생성
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFilePath(fileUrl);
            fileEntity.setFileType(file.getContentType());
            fileEntity.setFileSize((int) file.getSize());
            
            // WikiEntity와 연결

            // 4. FileEntity 저장
            fileRepository.save(fileEntity);
            fileRepository.flush();  // 즉시 DB에 반영
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
        // Optional을 사용하여 파일이 존재하지 않을 경우 예외를 던짐
        FileEntity fileEntity = fileRepository.findById(filePkNum)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다"));

        // FileEntity -> FileDto 변환
        FileDto fileDto = FileDto.fromEntity(fileEntity);

        // WikiEntity 정보 추가 조회
        if (fileEntity.getWikiEntity() != null) {
            WikiEntity wikiEntity = fileEntity.getWikiEntity(); // WikiEntity 가져오기
            fileDto.setWiki_regdate(wikiEntity.getWikiRegdate()); // 예시: Wiki의 regdate
            fileDto.setWiki_view(wikiEntity.getWikiView());

            // UserEntity 정보 추가 조회
            if (wikiEntity.getUserEntity() != null) {
                fileDto.setUser_name(wikiEntity.getUserEntity().getUserName());
            }
        }

        return fileDto; // WikiEntity 및 UserEntity의 추가 정보 포함된 FileDto 반환
    }



    // 수정
    @Override
    public FileDto updatePost(int filePkNum, FileForm fileForm) {
        FileEntity updatePost = fileRepository.findById(filePkNum).orElse(null);
        if (updatePost != null) {
            updatePost.setFileName(fileForm.getFile_name());
            updatePost.setFilePath(fileForm.getFile_path());
            updatePost.setFileSize(fileForm.getFile_size());
            updatePost.setFileType(fileForm.getFile_type());

            // FileEntity를 저장하여 업데이트된 내용을 반영
            FileEntity updatedFileEntity = fileRepository.save(updatePost);

            // WikiEntity 관련 정보를 FileDto에 설정
            FileDto fileDto = FileDto.fromEntity(updatedFileEntity);

            // WikiEntity가 존재하는 경우, 추가적인 정보를 FileDto에 설정
            if (updatedFileEntity.getWikiEntity() != null) {
                fileDto.setWiki_regdate(updatedFileEntity.getWikiEntity().getWikiRegdate());
                fileDto.setWiki_view(updatedFileEntity.getWikiEntity().getWikiView());
            }

            // 업데이트된 FileDto 반환
            return fileDto;
        }
        return null;
    }

    // 삭제
    @Override
    public void deletePost(int filePkNum) {
        // 먼저 파일 정보 가져오기
        FileEntity fileEntity = fileRepository.findById(filePkNum).orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다"));

        // Google Cloud Storage에서 파일 삭제
        deleteFileFromGCS(fileEntity.getFilePath());

        // 데이터베이스에서 파일 삭제
        fileRepository.deleteById(filePkNum);
    }

    // Google Cloud Storage에서 파일 삭제
    private void deleteFileFromGCS(String filePath) {
        try {
            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(ResourceUtils.getURL(keyFileName).openStream()))
                    .build()
                    .getService();
            Blob blob = storage.get(bucketName, filePath);
            if (blob != null) {
                blob.delete(); // Google Cloud Storage에서 파일 삭제
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
