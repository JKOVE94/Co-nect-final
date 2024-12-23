package conect.service.board.wiki;

import conect.data.dto.WikiDto;
import conect.data.entity.FileEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.WikiForm;
import conect.data.repository.FileRepository;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;
import jakarta.persistence.EntityNotFoundException;

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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WikiServiceImpl implements WikiService {

	@Autowired
	private WikiRepository wrepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProjectRepository projRepository;

	@Autowired
	private FileRepository fileRepository;

    //GCP Storage 세팅
    @Value("${spring.cloud.gcp.storage.credentials.location}")
    private String keyFileName;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

	@Override
	public String saveFile(WikiForm form) throws IOException {
		InputStream keyFile = null;
		String fileUrl = "";
		System.out.println("keyFileName : "+keyFileName);
		try {
			keyFile = ResourceUtils.getURL(keyFileName).openStream();
			System.out.println("실행중");

			// 파일 폴더내에 업로드한 파일명 그대로 업로드 (파일명 변경 가능)
			String fileName = "file/" + form.getFileInput().getOriginalFilename();
			String ext = form.getFileInput().getContentType(); // 파일 유형

			Storage storage = StorageOptions.newBuilder()
					.setCredentials(GoogleCredentials.fromStream(keyFile)).build()
					.getService();
			// Google Cloud Storage에 저장된 주소. 해당 주소로 파일에 바로 접근 가능
			fileUrl = "https://storage.googleapis.com/" + bucketName + "/" + fileName;

			if (form.getFileInput().isEmpty()) {
				fileUrl = null;
			} else {
				BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).setContentType(ext).build();
				Blob blob = storage.create(blobInfo, form.getFileInput().getInputStream());
			}
		} finally {
			if (keyFile != null) {
				keyFile.close();
			}
		}
		return fileUrl;
	}

	// 전체자료 읽기
	@Override
	public List<WikiDto> getListAll() {
		List<WikiEntity> entities = wrepository.findAll();
		return entities.stream().map(WikiDto::fromEntity).collect(Collectors.toList());
	}

	// 페이징, 정렬, 검색
	public Page<WikiDto> getList(int page, int pageSize, String sortField, String sortDirection, String searchType,
			String searchText) {
		// 정렬 정보 생성
		Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);

		// Pageable 객체 생성 (페이지와 정렬 정보 포함)
		Pageable pageable = PageRequest.of(page, pageSize, sort);

		// Repository를 통해 데이터를 조회
		Page<WikiEntity> wikiPage = Page.empty();

		if (searchType.equalsIgnoreCase("wiki_title")) {
			wikiPage = wrepository.findByWikiTitleContains(searchText, pageable);
		} else if (searchType.equalsIgnoreCase("user_name")) {
			wikiPage = wrepository.findByUserEntity_UserNameContains(searchText, pageable);
		} else {
			wikiPage = wrepository.findAll(pageable);
		}
		// PostEntity -> PostDto 변환
		return wikiPage.map(WikiDto::fromEntity);
	}
	
	//조회수 증가
    @Transactional
    @Override
    public void updateViewCount(int wikiPkNum, int userPkNum) {
        WikiEntity wiki = wrepository.findById(wikiPkNum).orElseThrow();
        List<Integer> viewers = wiki.getViewUsers();

        if (!viewers.contains(userPkNum)) {
            viewers.add(userPkNum);
            wiki.setViewUsers(viewers);
            wrepository.save(wiki);
        }
    }

	// 상세보기
	public WikiDto getWikiById(int wikiPkNum) {
	    return wrepository.findByIdWithFile(wikiPkNum)
	            .map(WikiDto::fromEntity)
	            .orElseThrow(() -> new EntityNotFoundException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
	}
	
	 // 위키 번호로 파일 정보 조회
    public FileEntity getWikiFileByWikiNum(int wikiPkNum) {
        return fileRepository.findByWikiEntity_WikiPkNum(wikiPkNum)
                           .orElse(null);
    }

	// 문서 생성 메서드
	@Transactional
	public int addWiki(WikiForm form) throws Exception {
		// DTO (WikiForm) -> Entity (WikiEntity)
		WikiEntity entity = WikiForm.toEntity(form);

		// 프로젝트, 작성자 설정
		ProjectEntity projEntity = projRepository.findById(form.getWiki_fk_proj_num())
				.orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
		UserEntity userEntity = userRepository.findById(form.getWiki_fk_user_num())
				.orElseThrow(() -> new RuntimeException("작성자가 존재하지 않습니다."));

		String fileUrl = null;
		// 파일이 있을 경우 파일 메타데이터 저장
		if (form.getFileInput() != null && !form.getFileInput().isEmpty()) {
			fileUrl = saveFile(form);
			FileEntity fileEntity = new FileEntity();
			fileEntity.setFileName(form.getFileInput().getOriginalFilename()); // 원본 파일명
			fileEntity.setFilePath(fileUrl); // 저장된 경로
			fileEntity.setFileSize((int) form.getFileInput().getSize()); // 파일 크기
			fileEntity.setFileType(form.getFileInput().getContentType()); // 파일 타입

			// WikiEntity와 연결
			fileEntity.setWikiEntity(entity);

			// 파일 정보 저장
			fileRepository.save(fileEntity);
		}

		entity.setProjectEntity(projEntity);
		entity.setUserEntity(userEntity);

		// Entity 저장 후, 저장된 엔티티 반환
		WikiEntity savedEntity = wrepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getWikiPkNum();
	}

	// 문서 수정 메서드
	@Transactional
	public void editWiki(int wikiPkNum, WikiForm form) throws Exception {
	    // 기존 위키 엔티티 조회
	    WikiEntity entity = wrepository.findById(wikiPkNum)
	            .orElseThrow(() -> new RuntimeException("문서가 존재하지 않습니다."));
	    // 기본 정보 업데이트
	    entity.setWikiTitle(form.getWiki_title());
	    entity.setWikiContent(form.getWiki_content());
	    entity.setWikiIsnotice(form.isWiki_isnotice());
	    // 프로젝트, 작성자 설정
	    ProjectEntity projEntity = projRepository.findById(form.getWiki_fk_proj_num())
	            .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
	    UserEntity userEntity = userRepository.findById(form.getWiki_fk_user_num())
	            .orElseThrow(() -> new RuntimeException("작성자가 존재하지 않습니다."));
	    
	    FileEntity existingFile = fileRepository.findByWikiEntity_WikiPkNum(wikiPkNum).orElse(null);
	    // 파일 처리
	    if (form.getFileInput() != null && !form.getFileInput().isEmpty()) {
	        if (existingFile != null) {
	            deleteWikiFile(wikiPkNum); // 기존 파일 삭제
	        }
	        // 새 파일 저장
	        String fileUrl = saveFile(form);
	        FileEntity newFileEntity = new FileEntity();
	        newFileEntity.setFileName(form.getFileInput().getName());
	        newFileEntity.setFilePath(fileUrl);
	        newFileEntity.setFileSize((int) form.getFileInput().getSize());
	        newFileEntity.setFileType(form.getFileInput().getContentType());
	        newFileEntity.setWikiEntity(entity);
	        fileRepository.save(newFileEntity);
	    }
	    entity.setProjectEntity(projEntity);
	    entity.setUserEntity(userEntity);
	    wrepository.save(entity);
	}

	// Google Cloud Storage에서 파일 삭제하는 메서드 추가
	public void deleteFileFromStorage(String fileUrl) {
	    try {
	        if (fileUrl != null && fileUrl.contains(bucketName)) {
	            InputStream keyFile = ResourceUtils.getURL(keyFileName).openStream();
	            Storage storage = StorageOptions.newBuilder()
	                    .setCredentials(GoogleCredentials.fromStream(keyFile))
	                    .build()
	                    .getService();
	            // URL에서 파일 경로 추출
	            String fileName = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);
	            // 파일 삭제
	            Blob blob = storage.get(bucketName, fileName);
	            if (blob != null && blob.exists()) {
	                blob.delete();
	            }
	            keyFile.close();
	        }
	    } catch (IOException e) {
	        throw new RuntimeException("파일 삭제 중 오류 발생", e);
	    }
	}

	 // 파일 삭제
    public void deleteWikiFile(int wikiPkNum) {
    	FileEntity fileEntity = fileRepository.findByWikiEntity_WikiPkNum(wikiPkNum)
                .orElse(null);
        if (fileEntity != null) {
            // Google Cloud Storage에서 파일 삭제
            deleteFileFromStorage(fileEntity.getFilePath());
            // DB에서 파일 정보만 삭제
            fileRepository.delete(fileEntity);
        }
    }
	
	// 문서 삭제
	public void deleteWiki(int wikiPkNum) {
		try {
			WikiEntity entity = wrepository.findById(wikiPkNum)
					.orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
			wrepository.delete(entity);
		} catch (RuntimeException e) {
			System.out.println("문서 삭제 중 오류 발생: " + e.getMessage());
		}
	}

}
