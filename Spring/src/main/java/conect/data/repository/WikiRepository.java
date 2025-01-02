package conect.data.repository;

import conect.data.entity.WikiEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WikiRepository extends JpaRepository<WikiEntity, Integer> {
    @Query("SELECT w FROM WikiEntity w JOIN FETCH w.userEntity WHERE w.wikiPkNum = :wikiPkNum")
    Optional<WikiEntity> findByIdWithUser(@Param("wikiPkNum") int wikiPkNum);

    // 페이징 및 정렬 지원 (Pageable을 사용하여 페이지와 정렬 정보 처리)
    @Query("SELECT w FROM WikiEntity w WHERE w.projectEntity.projPkNum =?1")
    Page<WikiEntity> findAll(int projPkNum, Pageable pageable);

    // 게시글 제목에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<WikiEntity> findByWikiTitleContains(String searchText, Pageable pageable);

    // 작성자 이름(userName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<WikiEntity> findByUserEntity_UserNameContains(String searchText, Pageable pageable);

    @Query("SELECT w FROM WikiEntity w LEFT JOIN FETCH w.fileEntity WHERE w.wikiPkNum = :wikiPkNum")
    Optional<WikiEntity> findByIdWithFile(@Param("wikiPkNum") int wikiPkNum);
}
