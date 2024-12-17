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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
