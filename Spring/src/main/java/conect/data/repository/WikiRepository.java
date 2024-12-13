package conect.data.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import conect.data.entity.WikiEntity;

public interface WikiRepository extends JpaRepository<WikiEntity, Integer> {
	
	@Query("SELECT w FROM WikiEntity w JOIN FETCH w.userEntity WHERE w.wikiPkNum = :wikiPkNum")
	Optional<WikiEntity> findByIdWithUser(@Param("wikiPkNum") int wikiPkNum);
	
	 // 페이징 및 정렬 지원 (Pageable을 사용하여 페이지와 정렬 정보 처리)
    Page<WikiEntity> findAll(Pageable pageable);
    
    // 게시글 제목(postName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<WikiEntity> findByWikiNameContains(String searchText, Pageable pageable);

    // 작성자 이름(userName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<WikiEntity> findByUserEntity_UserNameContains(String searchText, Pageable pageable);
}
