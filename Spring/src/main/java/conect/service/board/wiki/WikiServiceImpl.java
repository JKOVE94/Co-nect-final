package conect.service.board.wiki;

import conect.data.dto.ProjectDto;
import conect.data.dto.WikiDto;
import conect.data.entity.ProjectEntity;
import conect.data.entity.UserEntity;
import conect.data.entity.WikiEntity;
import conect.data.form.WikiForm;
import conect.data.repository.ProjectRepository;
import conect.data.repository.UserRepository;
import conect.data.repository.WikiRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

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

	// 전체자료 읽기
	@Override
	public List<WikiDto> getListAll() {
		List<WikiEntity> entities = wrepository.findAll();
		return entities.stream()
				.map(WikiDto::fromEntity)
				.collect(Collectors.toList());
	}

	// 상세보기
	public WikiDto getWikiById(int wikiPkNum) {
		return wrepository.findByIdWithUser(wikiPkNum)
				.map(WikiDto::fromEntity)
				.orElseThrow(() -> new EntityNotFoundException("문서를 찾을 수 없습니다. ID: " + wikiPkNum));
	}

	// 모든 프로젝트를 DTO로 반환 (셀렉트 박스용)
	public List<ProjectDto> getAllProjects() {
		List<ProjectEntity> entities = projRepository.findAll();
		return entities.stream()
				.map(ProjectDto::fromEntity)
				.collect(Collectors.toList());
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
		WikiEntity entity = wrepository
				.findById(form.getWiki_pk_num())
				.orElseThrow(() -> new RuntimeException("문서가 존재하지 않습니다."));

		// 기존 proj_created 값은 그대로 유지하고, 나머지 필드를 수정
		WikiEntity updatedEntity = WikiForm.toEntity(form);
		updatedEntity.setWikiRegdate(entity.getWikiRegdate()); // 기존 작성일 유지

		entity.setWikiName(updatedEntity.getWikiName());
		entity.setWikiDesc(updatedEntity.getWikiDesc());
		entity.setWikiIsNotice(updatedEntity.isWikiIsNotice());

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

	/*
	//검색용 status list 출력
	@Override
	public Set<String> getStatusAll(int compNum) {
		List<ProjectDto> list = 
				prepository.findByProjCompNum(compNum).stream().map(ProjectDto::fromEntity).toList();
		Set<String> statusList = new HashSet<String>();
		for(ProjectDto dto : list) {
			String status = dto.getProj_status();
			if(!status.isEmpty()) {
				statusList.add(status);
			}
		}
		return statusList;
	}
	
	//검색
	@Override
	public List<ProjectDto> getSearchData(String status, String title) {
		
		return prepository.findByProjStatusContainsAndProjNameContains(status, title)
				.stream().map(ProjectDto::fromEntity).toList();
	}
	 */
}
