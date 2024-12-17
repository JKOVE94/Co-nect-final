package conect.service.board.file;

import java.io.IOException;
import java.io.InputStream;
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
import conect.data.entity.WikiEntity;
import conect.data.form.FileForm;
import conect.data.form.PostForm;
import conect.data.form.UserForm;
import conect.data.repository.FileRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
			// String ext = form.getUser_picfile().getContentType();
			
			
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
	    try {
	        // WikiEntity 조회 (wiki_pk_num을 사용하여 WikiEntity 객체를 조회)
	        WikiEntity wikiEntity = wikiRepository.findById(fileForm.getWiki_pk_num())
	                .orElseThrow(() -> new RuntimeException("Wiki가 존재하지 않습니다"));

	        // FileEntity 객체 생성
	        FileEntity fileEntity = new FileEntity();
	        fileEntity.setFileName(file.getOriginalFilename());
	        fileEntity.setFilePath(fileForm.getFile_path());
	        fileEntity.setFileType(file.getContentType());
	        fileEntity.setFileSize((int) file.getSize());
	        fileEntity.setWikiEntity(wikiEntity); // WikiEntity 객체를 설정

	        // 파일 저장
	        fileRepository.save(fileEntity);

	        return fileEntity;
	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new RuntimeException("파일 저장 중 오류 발생");
	    }
	}



	// 전체 조회
	@Override
	public List<FileDto> getPostAll() {
		return fileRepository.findAll().stream().map(FileDto::fromEntity).collect(Collectors.toList());
	}

	// 부분 조회
	@Override
    public FileDto getPostView(Integer filePkNum) {
        FileEntity fileEntity = fileRepository.findById(filePkNum).orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다"));

        // FileDto로 변환
        FileDto fileDto = FileDto.fromEntity(fileEntity);

        // WikiEntity 정보 추가 조회
        if (fileEntity.getWikiEntity() != null) {
            WikiEntity wikiEntity = fileEntity.getWikiEntity(); // WikiEntity 가져오기
            fileDto.setWiki_regdate(wikiEntity.getWikiRegdate()); // 예시: Wiki의 regdate
        }

        return fileDto; // WikiEntity의 추가 정보 포함된 FileDto 반환
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
    	
    	 // null 또는 빈 값에 대한 기본 처리
        if (searchType == null || searchType.isEmpty()) {
            searchType = "default";
        }
        if (searchText == null) {
            searchText = "";
        }
    	
    	
    	if (searchType != null && searchType.equalsIgnoreCase("file_name")) {
    	    postPage = fileRepository.findByFileNameContains(searchText, pageable);
    	} else {
    	    postPage = fileRepository.findAll(pageable); // 기본 조회
    	}

    	
	    // PostEntity -> postDto 변환
	    return postPage.map(FileDto::fromEntity);
	}
}
