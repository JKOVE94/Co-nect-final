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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

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
import java.time.LocalDate;
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
	public String saveFile(WikiForm form) throws Exception {
		InputStream keyFile = null;
		String fileUrl = "";
		System.out.println("keyFileName : "+keyFileName);
		try {
			keyFile = ResourceUtils.getURL(keyFileName).openStream();
			System.out.println("실행중");

			// 파일 폴더내에 업로드한 파일명 그대로 업로드 (파일명 변경 가능)
			String fileName = "file/" + form.getFileInput().getOriginalFilename();
			String ext = form.getFileInput().getContentType(); // 파일 유형

			 System.out.println("File name: " + fileName);
		        System.out.println("File type (content type): " + ext);
			
			Storage storage = StorageOptions.newBuilder()
					.setCredentials(GoogleCredentials.fromStream(keyFile)).build()
					.getService();
			
			System.out.println(storage);
			
			// Google Cloud Storage에 저장된 주소. 해당 주소로 파일에 바로 접근 가능
			fileUrl = "https://storage.googleapis.com/" + bucketName + "/" + fileName;

			if (form.getFileInput().isEmpty()) {
				fileUrl = null;
				System.out.println(fileUrl);
			} else {
				BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).setContentType(ext).build();
				System.out.println(blobInfo);
				Blob blob = storage.create(blobInfo, form.getFileInput().getInputStream());
				System.out.println(blob.getMediaLink());
			}
		} finally {
			if (keyFile != null) {
				keyFile.close();
				System.out.println(keyFile);
			}
		}
		System.out.println("=fileUrl====" + fileUrl);
		return fileUrl;
	}

	// 전체자료 읽기
	@Override
	public List<WikiDto> getListAll() {
		List<WikiEntity> entities = wrepository.findAll();
		return entities.stream().map(WikiDto::fromEntity).collect(Collectors.toList());
	}

	// 페이징, 정렬, 검색
	public Page<WikiDto> getList(int projPkNum, int page, int pageSize, String sortField, String sortDirection, String searchType,
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
			wikiPage = wrepository.findAll(projPkNum, pageable);
		}
		// PostEntity -> PostDto 변환
		return wikiPage.map(WikiDto::fromEntity);
	}

	// 상세보기
	public WikiDto getWikiById(int wikiPkNum) {
	    return wrepository.findByIdWithFile(wikiPkNum)
	            .map(WikiDto::fromEntity)
	            .orElseThrow(() -> new EntityNotFoundException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
	}
	
	// 부분 조회 (조회수 증가 포함)
    @Override
    public WikiDto getPostView(Integer wikiPkNum, HttpServletRequest request, HttpServletResponse response) {
    	 // 세션에서 조회 기록 확인
        HttpSession session = request.getSession();
        String sessionKey = "viewedPost_" + wikiPkNum;
        Boolean hasViewedInSession = (Boolean) session.getAttribute(sessionKey);
    	
    	// 쿠키 확인
        Cookie[] cookies = request.getCookies();
        boolean hasViewedInCookie = false; // 게시물 확인 여부

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("viewedPost_" + wikiPkNum)) {
                	hasViewedInCookie  = true;
                    break;
                }
            }
        }


        // 조회수 증가
        // 조회수 확인되었을 때 실행되는 로직
        if ((hasViewedInSession == null || !hasViewedInSession) && !hasViewedInCookie) {
            incrementViewCount(wikiPkNum);
            
            // 세션에 조회 기록 저장
            session.setAttribute(sessionKey, true);

            // 새로운 쿠키 생성
            Cookie newCookie = new Cookie("viewedPost_" + wikiPkNum, "true"); 
            // 쿠키 이름 : 확인된게시물_게시물PkNum => 특정 파일을 사용자가 조회했는지 쿠키로 저장합니다. 
            // 해당 게시물을 1일 이내 다시 조회하면 저장된 쿠키를 확인하고 조회수 증가 X
            newCookie.setMaxAge(86400); // 쿠키 유효 기간 : 1일
            newCookie.setHttpOnly(true);
            newCookie.setPath("/"); // 모든 경로에서 쿠키 유효
            response.addCookie(newCookie);
        }
        
        // 부분 조회 로직
        WikiEntity wikiEntity = wrepository.findById(wikiPkNum)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        WikiDto wikiDto = WikiDto.fromEntity(wikiEntity);

        if (wikiEntity.getFileEntity() != null) {
            FileEntity fileEntity = wikiEntity.getFileEntity();
            wikiDto.setWiki_regdate(wikiEntity.getWikiRegdate());
            wikiDto.setWiki_view(wikiEntity.getWikiView());
            if (wikiEntity.getUserEntity() != null) {
            	wikiDto.setUser_name(wikiEntity.getUserEntity().getUserName());
            }
        }

        return wikiDto;
    }
    

    // 조회수 증가 로직
    @Transactional
    public void incrementViewCount(Integer wikiPkNum) {
    	 WikiEntity wikiEntity = wrepository.findById(wikiPkNum)
                 .orElseThrow(() -> new RuntimeException("문서가 존재하지 않습니다."));
        
        if (wikiEntity != null) { // wikiEntity가 비어있지 않을 때 조회수 증가
            wikiEntity.setWikiView(wikiEntity.getWikiView() + 1);
            wrepository.save(wikiEntity);
        }
    }
    
	 // 위키 번호로 파일 정보 조회
    public FileEntity getWikiFileByWikiNum(int wikiPkNum) {
        return fileRepository.findByWikiEntityWikiPkNum(wikiPkNum)
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

		entity.setProjectEntity(projEntity);
		entity.setUserEntity(userEntity);

		String fileUrl = null;
		// 파일이 있을 경우 파일 메타데이터 저장
		if (form.getFileInput() != null && !form.getFileInput().isEmpty()) {
			fileUrl = saveFile(form);
			FileEntity fileEntity = new FileEntity();
			fileEntity.setFileName(form.getFileInput().getOriginalFilename()); // 원본 파일명
			fileEntity.setFilePath(fileUrl); // 저장된 경로
			fileEntity.setFileSize((int) form.getFileInput().getSize());

			String fileType = form.getFileInput().getContentType();
			if (fileType != null && fileType.length() > 50) {
				fileType = fileType.substring(0, 50);
			}
			fileEntity.setFileType(form.getFileInput().getContentType()); // 파일 타입

			// WikiEntity와 연결
			fileEntity.setWikiEntity(entity);

			// 파일 정보 저장
			fileRepository.save(fileEntity);
		}



		// Entity 저장 후, 저장된 엔티티 반환
		WikiEntity savedEntity = wrepository.save(entity);

		// 저장된 엔티티의 Primary Key 반환
		return savedEntity.getWikiPkNum();
	}
	
	// 문서 수정
	@Transactional(rollbackFor = {Exception.class, RuntimeException.class})
	public void editWiki(int wikiPkNum, WikiForm form) throws Exception {
	    try {
	        // 문서 조회
	        WikiEntity entity = wrepository.findById(wikiPkNum)
	                .orElseThrow(() -> new RuntimeException("문서가 존재하지 않습니다."));

	        // 연관 엔티티 조회
	        ProjectEntity projEntity = projRepository.findById(form.getWiki_fk_proj_num())
	                .orElseThrow(() -> new RuntimeException("프로젝트가 존재하지 않습니다."));
	        UserEntity userEntity = userRepository.findById(form.getWiki_fk_user_num())
	                .orElseThrow(() -> new RuntimeException("작성자가 존재하지 않습니다."));

	        // 문서 정보 업데이트
	        entity.setWikiTitle(form.getWiki_title());
	        entity.setWikiContent(form.getWiki_content());
	        entity.setWikiIsnotice(form.isWiki_isnotice());
	        entity.setProjectEntity(projEntity);
	        entity.setUserEntity(userEntity);


	        // 파일 처리
	        FileEntity existingFile = fileRepository.findByWikiEntityWikiPkNum(wikiPkNum).orElse(null);
	        String fileStatus = form.getFileStatus();
//			System.out.println("--------------------");
//			System.out.println(existingFile.getFilePkNum());
	        // 파일 없이 문서 수정 (파일이 없으면 새로운 파일을 처리하지 않고 글만 수정)
	        if ("TEXT".equals(fileStatus) && existingFile != null) {
				System.out.println("----TEXT----");
	            // 새 파일이 없으므로, 그냥 글만 수정하고 파일은 저장하지 않음
	            System.out.println("파일 없이 글만 수정");
	            wrepository.save(entity);
	            return;
	        }

	        
	        // 파일 삭제 요청
		   else if ("DELETE".equals(fileStatus) && existingFile != null) {
				System.out.println("----DELETE----");
				entity.setFileEntity(null);
				wrepository.save(entity);
			   System.out.println("파일 삭제 처리 시작");
			   //deleteFile(existingFile.getFilePkNum());
			   // DB에서 파일 삭제
			   fileRepository.delete(existingFile);


			   // 삭제된 파일이 DB에서 반영되었는지 확인
			   FileEntity deletedFile = fileRepository.findByWikiEntityWikiPkNum(wikiPkNum).orElse(null);
			   if (deletedFile == null) {
				   System.out.println("파일이 DB에서 삭제되었습니다.");
			   } else {
				   System.out.println("파일이 DB에서 삭제되지 않았습니다.");
			   }

			   System.out.println("파일 삭제 완료");
		   }


	        // 파일 변경이 없으면, 파일 처리 없이 문서만 저장
	        else if ("KEEP".equals(fileStatus)) {
				System.out.println("----KEEP----");
	            // 파일 변경 없이 그냥 문서만 업데이트
	            wrepository.save(entity);
	            return;
	        }
	        
	        else if ("REPLACE".equals(fileStatus) && existingFile != null) {
				System.out.println("----Replace----");
				wrepository.save(entity);
	            // 기존 파일 덮어쓰기
	            if (existingFile != null) {
	                // 기존 파일 정보 업데이트
	                String newFileUrl = saveFile(form);
	                existingFile.setFileName(form.getFileInput().getOriginalFilename());
	                existingFile.setFilePath(newFileUrl);
	                existingFile.setFileSize((int) form.getFileInput().getSize());

	                String fileType = form.getFileInput().getContentType();
	                if (fileType != null && fileType.length() > 50) {
	                    fileType = fileType.substring(0, 50);
	                }
	                existingFile.setFileType(fileType);
	                
	                // 기존 파일 엔티티를 업데이트하여 저장
	                fileRepository.save(existingFile);
	                fileRepository.flush();
	                System.out.println("기존 파일 덮어쓰기 완료: " + existingFile);
	            } else {
	                // 기존 파일이 없으면 새 파일 저장
	                String fileUrl = saveFile(form);
	                System.out.println("새 파일 저장 완료. 파일 URL: " + fileUrl);
	                
	                // 새 파일 엔티티 생성 및 저장
	                FileEntity newFileEntity = new FileEntity();
	                newFileEntity.setFileName(form.getFileInput().getOriginalFilename());
	                newFileEntity.setFilePath(fileUrl);
	                newFileEntity.setFileSize((int) form.getFileInput().getSize());

	                String fileType = form.getFileInput().getContentType();
	                if (fileType != null && fileType.length() > 50) {
	                    fileType = fileType.substring(0, 50);
	                }
	                newFileEntity.setFileType(fileType);
	                newFileEntity.setWikiEntity(entity);

	                fileRepository.save(newFileEntity);
	                System.out.println("새 파일 엔티티 저장 완료: " + newFileEntity);
	            }
	        }

			else if ("REPLACE".equals(fileStatus) && existingFile == null) {
				System.out.println("----Replace2----");
				wrepository.save(entity);

					// 기존 파일이 없으면 새 파일 저장
					String fileUrl = saveFile(form);
					System.out.println("새 파일 저장 완료. 파일 URL: " + fileUrl);

					// 새 파일 엔티티 생성 및 저장
					FileEntity newFileEntity = new FileEntity();
					newFileEntity.setFileName(form.getFileInput().getOriginalFilename());
					newFileEntity.setFilePath(fileUrl);
					newFileEntity.setFileSize((int) form.getFileInput().getSize());

					String fileType = form.getFileInput().getContentType();
					if (fileType != null && fileType.length() > 50) {
						fileType = fileType.substring(0, 50);
					}
					newFileEntity.setFileType(fileType);
					newFileEntity.setWikiEntity(entity);
				entity.setFileEntity(fileRepository.save(newFileEntity));
//					fileRepository.save(newFileEntity);
				wrepository.save(entity);
					System.out.println("새 파일 엔티티 저장 완료: " + newFileEntity);

			}
			System.out.println("----------end----------");



	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new Exception("문서 수정 중 오류 발생: " + e.getMessage());
	    }
	}

	// 파일 삭제
	@Transactional
	public void deleteFile(int filePkNum) {
	    FileEntity file = fileRepository.findById(filePkNum)
	            .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

	    fileRepository.delete(file); // FileEntity만 삭제
	}

	// 문서 삭제
	public void deleteWiki(int wikiPkNum) {
		try {
			WikiEntity entity = wrepository.findById(wikiPkNum)
					.orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
			FileEntity existingFile = fileRepository.findByWikiEntityWikiPkNum(wikiPkNum).orElse(null);
			if (existingFile != null) {
	            // 파일 시스템에서 파일 삭제 (옵션)
	            File file = new File(existingFile.getFilePath());
	            if (file.exists()) {
	                file.delete();
	            }
	            // 데이터베이스에서 파일 삭제
	            fileRepository.delete(existingFile);
	            System.out.println("파일 삭제 완료: " + existingFile.getFileName());
	        }
			
			wrepository.delete(entity);
			System.out.println("문서 삭제 완료: " + entity.getWikiTitle());
		} catch (RuntimeException e) {
			System.out.println("문서 삭제 중 오류 발생: " + e.getMessage());
		}
	}
	@Override
	public int addWikiEntity(String wikiTitle, String wikiContent, Integer userNum, Integer projNum, boolean wikiNotice) {
		// WikiEntity 저장
		WikiEntity wikiEntity = new WikiEntity();
		wikiEntity.setWikiTitle(wikiTitle);
		wikiEntity.setWikiContent(wikiContent);
		wikiEntity.setWikiBoardtype(false);  // false로 설정 (파일 게시판)
		wikiEntity.setWikiView(0); // 초기 조회수
		wikiEntity.setWikiRegdate(LocalDate.now()); // 작성일
		wikiEntity.setUserEntity(userRepository.findById(userNum).get());
		wikiEntity.setProjectEntity(projRepository.findById(projNum).get());
		wikiEntity.setWikiIsnotice(wikiNotice);

		return wrepository.save(wikiEntity).getWikiPkNum();
	}

}
