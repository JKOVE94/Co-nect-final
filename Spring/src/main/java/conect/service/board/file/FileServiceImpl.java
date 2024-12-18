package conect.service.board.file;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import conect.data.repository.WikiRepository;

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
        return fileUrl;
    }

    // 게시글 생성 시 파일 저장 및 WikiEntity와 연결
    public FileEntity insertPost(MultipartFile file, FileForm fileForm) {
        // FileEntity 객체 생성
        FileEntity fileEntity = new FileEntity();

        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFilePath(fileForm.getFile_path());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFileSize((int) file.getSize());

        // file_fk_wiki_num이 0 또는 null일 경우 처리
        if (fileForm.getFile_fk_wiki_num() != null && fileForm.getFile_fk_wiki_num() > 0) {
            // 유효한 WikiEntity가 있을 경우만 설정
            fileEntity.setWikiEntity(wikiRepository.findById(fileForm.getFile_fk_wiki_num())
                .orElseThrow(() -> new RuntimeException("해당 WikiEntity를 찾을 수 없습니다. ID: " + fileForm.getFile_fk_wiki_num())));
        }

        // 파일 저장
        fileRepository.save(fileEntity);

        return fileEntity;
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
        }

        return fileDto; // WikiEntity의 추가 정보 포함된 FileDto 반환
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
}
