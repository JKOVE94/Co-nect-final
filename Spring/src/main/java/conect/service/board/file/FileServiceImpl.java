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
	
	@Autowired
	private UserRepository userRepository;

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
			String fileName = "file/" +originalFileName;
			// String ext = form.getUser_picfile().getContentType();
			
			
			Storage storage = StorageOptions.newBuilder()
					.setCredentials(GoogleCredentials.fromStream(keyFile))
					.build()
					.getService();
			
			// BlobInfo 생성 (파일 정보)
	        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, form.getFile_name()).build();

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

		fileEntity.setFilePostName(fileForm.getFile_post_name());
		fileEntity.setFileName(fileForm.getFile_name());
		fileEntity.setFilePath(saveFile(fileForm, file));
		fileEntity.setFileSize(fileForm.getFile_size());
		fileEntity.setFileType(fileForm.getFile_type());
		fileEntity.setFileDownload(fileForm.getFile_download());
		fileEntity.setUserEntity(userRepository.findById(fileForm.getFile_fk_user_num()).get());
		fileEntity.setFileRegdate(fileForm.getFile_regdate());
		
		return fileRepository.save(fileEntity);
	}

	// 전체 조회
	@Override
	public List<FileDto> getPostAll() {
		return fileRepository.findAll().stream().map(FileDto::fromEntity).collect(Collectors.toList());
	}

	// 부분 조회, 조회수(Cookie)
	@Override
    public FileDto getPostView(Integer filePkNum, HttpServletRequest request, HttpServletResponse response) {
        // 조회수 증가 로직
		// frepository.incrementView(postPkNum); // 조회수 증가 쿼리 실행
		
        Cookie oldCookie = null;
        Cookie[] cookies = request.getCookies();
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("postView")) {
                    oldCookie = cookie;
                }
            }
        }

        if (oldCookie != null) {
            // 쿠키 값에 게시글 ID가 없다면 조회수 증가
            if (!oldCookie.getValue().contains("[" + filePkNum.toString() + "]")) {
                updateHits(filePkNum); // 조회수 증가
                oldCookie.setValue(oldCookie.getValue() + "_[" + filePkNum + "]"); // 쿠키 값에 게시글 ID 추가
                oldCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효 기간 1일
                oldCookie.setPath("/"); // 쿠키 경로 설정
                response.addCookie(oldCookie); // 변경된 쿠키를 클라이언트에 추가
            }
        } else {
            // 쿠키가 없다면 새로운 쿠키 생성 후 조회수 증가
            updateHits(filePkNum);
            Cookie newCookie = new Cookie("postView", "[" + filePkNum + "]");
            newCookie.setMaxAge(60 * 60 * 24); // 쿠키 유효 기간 1일
            newCookie.setPath("/"); // 쿠키 경로 설정
            response.addCookie(newCookie); // 새로운 쿠키를 클라이언트에 추가
        }

        // 게시글 정보 조회 후 DTO 반환
        Optional<FileEntity> fileEntityOptional = fileRepository.findById(filePkNum);
        if (fileEntityOptional.isPresent()) {
            FileEntity fileEntity = fileEntityOptional.get();
            return FileDto.fromEntity(fileEntity); // DTO로 변환하여 반환
        } else {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
    }

	// 조회수 증가 메소드
    @Transactional
    public int updateHits(Integer filePkNum) {
        return fileRepository.incrementView(filePkNum); // 해당 게시글의 조회수를 증가시키는 메소드
    }

	// 수정
	@Override
	public FileDto updatePost(int filePkNum, FileForm fileForm) { // postId를 postPkNum으로 변경
		FileEntity updatePost = fileRepository.findById(filePkNum).orElse(null); // postId를 postPkNum으로 변경
		if (updatePost != null) {
			updatePost.setFilePostName(fileForm.getFile_post_name());
			updatePost.setFileName(fileForm.getFile_name());
			updatePost.setFilePath(fileForm.getFile_path());
			updatePost.setFileSize(fileForm.getFile_size());
			updatePost.setFileType(fileForm.getFile_type());
			updatePost.setFileDownload(fileForm.getFile_download());
			updatePost.setFileRegdate(fileForm.getFile_regdate());
			
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
    	} else if(searchType.equalsIgnoreCase("user_name")) {
    		postPage = fileRepository.findByUserEntity_UserNameContains(searchText, pageable);
    	} else {
    		postPage = fileRepository.findAll(pageable);
    	}
	    // PostEntity -> PostDto 변환
	    return postPage.map(FileDto::fromEntity);
	}
}
