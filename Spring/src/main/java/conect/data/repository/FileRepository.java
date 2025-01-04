package conect.data.repository;

import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FileRepository extends JpaRepository<FileEntity, Integer> {
	// 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
	Page<FileEntity> findAll(Pageable pageable);

	// 검색 - file name
	Page<FileEntity> findByFileNameContains(String searchText, int projNum, Pageable pageable);

	// 검색 - 작성자명 (WikiEntity와 연관된 userEntity 사용)
	Page<FileEntity> findByWikiEntity_UserEntity_UserNameContains(String searchText, int projNum, Pageable pageable);

	Optional<FileEntity> findByWikiEntity(WikiEntity wikiEntity);

	Optional<FileEntity> findByWikiEntityWikiPkNum(int wikiPkNum);
	
	// 특정 프로젝트 번호에 속하는 모든 파일
	Page<FileEntity> findByWikiEntity_ProjectEntity_ProjPkNum(int projNum, Pageable pageable);



}
