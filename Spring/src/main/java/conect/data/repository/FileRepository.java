package conect.data.repository;

import conect.data.entity.FileEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FileRepository extends JpaRepository<FileEntity,Integer> {
	
	@EntityGraph(attributePaths = {"wikiEntity", "wikiEntity.userEntity"})
    List<FileEntity> findAll();
	
	@EntityGraph(attributePaths = {"wikiEntity", "wikiEntity.userEntity"})
	Optional<FileEntity> findById(Integer filePkNum);

	
	//검색 - file name
	Page<FileEntity> findByFileNameContains(String searchText, Pageable pageable);
	// 검색 - 작성자명 (WikiEntity와 연관된 userEntity 사용)
    Page<FileEntity> findByWikiEntity_UserEntity_UserNameContains(String searchText, Pageable pageable);}
