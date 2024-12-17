package conect.service.board.wiki;

import conect.data.dto.ProjectDto;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.util.Value;
import com.google.auth.oauth2.GoogleCredentials;
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
    public void saveFile(MultipartFile file, int wikiPkNum) throws IOException {
        // 1. 파일 검증 로직: 타입 및 사이즈 확인
        long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 제한
        
        // 타입 확인 (이미지 파일만 허용)
        if (file == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }
        
        // 사이즈 확인
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없습니다.");
        }

        // 2. 파일 저장 경로 설정 (로컬 경로)
        String uploadDir = "C:/uploads/";
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + fileName;

        // 3. 로컬 디렉토리에 파일 저장
        File destination = new File(filePath);
        destination.getParentFile().mkdirs(); // 디렉토리 없으면 생성
        file.transferTo(destination);

        // 4. 파일 메타데이터 저장 (DB에 FileEntity 저장)
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename()); // 원본 파일명
        fileEntity.setFilePath(filePath); // 저장된 경로
        fileEntity.setFileSize((int) file.getSize()); // 파일 크기
        fileEntity.setFileType(file.getContentType()); // 파일 타입

        // 5. WikiEntity와 연결
        WikiEntity wikiEntity = wrepository.findById(wikiPkNum)
                .orElseThrow(() -> new RuntimeException("해당 Wiki 문서가 존재하지 않습니다."));
        fileEntity.setWikiEntity(wikiEntity);

        // 6. 파일 정보 저장
        fileRepository.save(fileEntity);
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

	// 상세보기
	public WikiDto getWikiById(int wikiPkNum) {
		return wrepository.findByIdWithUser(wikiPkNum).map(WikiDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
	}

	// 문서 생성 메서드
	@Transactional
	public int addWiki(WikiForm form) {
		// DTO (WikiForm) -> Entity (WikiEntity)
		WikiEntity entity = WikiForm.toEntity(form);

		// 프로젝트, 작성자 설정
		ProjectEntity projEntity = projRepository.findById(form.getWiki_fk_proj_num())
				.orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
		UserEntity userEntity = userRepository.findById(form.getWiki_fk_user_num())
				.orElseThrow(() -> new RuntimeException("작성자가 존재하지 않습니다."));

		entity.setProjectEntity(projEntity);
		entity.setUserEntity(userEntity);

		// Entity 저장 후, 저장된 엔티티 반환
		WikiEntity savedEntity = wrepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getWikiPkNum();
	}

	// 문서 수정 메서드
	public void editWiki(int wikiPkNum, WikiForm form) {
		// 프로젝트 번호로 기존 프로젝트 조회
		WikiEntity entity = wrepository.findById(form.getWiki_pk_num())
				.orElseThrow(() -> new RuntimeException("문서가 존재하지 않습니다."));

		WikiEntity updatedEntity = WikiForm.toEntity(form);
		updatedEntity.setWikiRegdate(entity.getWikiRegdate()); // 기존 작성일 유지

		entity.setWikiTitle(updatedEntity.getWikiTitle());
		entity.setWikiContent(updatedEntity.getWikiContent());
		entity.setWikiIsnotice(updatedEntity.isWikiIsnotice());

		// 프로젝트, 작성자 설정
		ProjectEntity projEntity = projRepository.findById(form.getWiki_fk_proj_num())
				.orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
		UserEntity userEntity = userRepository.findById(form.getWiki_fk_user_num())
				.orElseThrow(() -> new RuntimeException("작성자가 존재하지 않습니다."));

		entity.setProjectEntity(projEntity);
		entity.setUserEntity(userEntity);

		wrepository.save(entity); // 수정된 Entity 저장
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
