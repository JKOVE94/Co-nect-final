package conect.service.board.file;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
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
import conect.data.form.FileForm;
import conect.data.form.PostForm;
import conect.data.form.UserForm;
import conect.data.repository.FileRepository;
import conect.data.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class FileServiceImpl implements FileService {
	
	@Autowired
	private FileRepository fileRepository;

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
			String fileName = "file/" + originalFileName;
			// String ext = form.getUser_picfile().getContentType();
			
			
			Storage storage = StorageOptions.newBuilder()
					.setCredentials(GoogleCredentials.fromStream(keyFile))
					.build()
					.getService();
			
			// BlobInfo 생성 (파일 정보)
	        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).build();

	        // Google Cloud Storage에 파일 업로드
	        storage.create(blobInfo, file.getBytes());

			fileUrl = "https://storage.googleapis.com/" + bucketName + "/" + fileName;

		} finally {
			if (keyFile != null) {
				keyFile.close();
			}
		}
		return fileUrl;
	}
	
	// 삽입
	@Override
	public FileEntity insertPost(MultipartFile file, FileForm fileForm) throws IOException{
		FileEntity fileEntity = new FileEntity();

		fileEntity.setFileName(fileForm.getFile_name());
		fileEntity.setFilePath(saveFile(fileForm, file));
		fileEntity.setFileSize(fileForm.getFile_size());
		fileEntity.setFileType(file.getContentType());
		
		return fileRepository.save(fileEntity);
	}

	// 전체 조회
	@Override
	public List<FileDto> getPostAll() {
		return fileRepository.findAll().stream().map(FileDto::fromEntity).collect(Collectors.toList());
	}

	// 부분 조회, 조회수(Cookie)
	@Override
    public FileDto getPostView(Integer filePkNum) {
        // 게시글 정보 조회 후 DTO 반환
        Optional<FileEntity> fileEntityOptional = fileRepository.findById(filePkNum);
        if (fileEntityOptional.isPresent()) {
            FileEntity fileEntity = fileEntityOptional.get();
            return FileDto.fromEntity(fileEntity); // DTO로 변환하여 반환
        } else {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
    }


	// 수정
	@Override
	public FileDto updatePost(int filePkNum, FileForm fileForm) { // postId를 postPkNum으로 변경
		FileEntity updatePost = fileRepository.findById(filePkNum).orElse(null); // postId를 postPkNum으로 변경
		if (updatePost != null) {
			updatePost.setFileName(fileForm.getFile_name());
			updatePost.setFilePath(fileForm.getFile_path());
			updatePost.setFileSize(fileForm.getFile_size());
			updatePost.setFileType(fileForm.getFile_type());
			
			return FileDto.fromEntity(fileRepository.save(updatePost));
		}
		return null;
	}

	// 삭제
	@Override
	public void deletePost(int filePkNum) {
		fileRepository.deleteById(filePkNum);
	}

	// 페이징, 정렬, 검색
	public Page<FileDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType, String searchText) {
	    // 정렬 정보 생성
	    Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);

	    // Pageable 객체 생성 (페이지와 정렬 정보 포함)
	    Pageable pageable = PageRequest.of(page, pageSize, sort);
	    
	    // Repository를 통해 데이터를 조회
    	Page<FileEntity> postPage = Page.empty();
    	
    	if (searchType.equalsIgnoreCase("file_name")) {
    		postPage = fileRepository.findByFileNameContains(searchText, pageable);
    	} else {
    		postPage = fileRepository.findAll(pageable);
    	}
	    // PostEntity -> PostDto 변환
	    return postPage.map(FileDto::fromEntity);
	}
}
