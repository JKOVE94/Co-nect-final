package conect.data.repository;

import conect.data.entity.RecommendationEntity;
import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecommendationRepository extends JpaRepository<RecommendationEntity,Integer> {
	
	//프로젝트에 연결된 건의사항 목록 반환
	Page<RecommendationEntity> findByProjectEntity_projPkNum(int projNum, Pageable pageable);
	
	//건의사항 좋아요 수 오름차순 정렬
	@Query("SELECT r FROM RecommendationEntity r " +
		       "WHERE r.projectEntity.projPkNum = :num " +
		       "ORDER BY SIZE(r.reclikesEntities) ASC")
	Page<RecommendationEntity> findByProjectEntity_projPkNumOrderByRecLikesAsc(@Param("num") int projNum, Pageable pageable);
	
	
	//건의사항 좋아요 수 내림차순 정렬
	@Query("SELECT r FROM RecommendationEntity r " +
		       "WHERE r.projectEntity.projPkNum = :num " +
		       "ORDER BY SIZE(r.reclikesEntities) DESC")
	Page<RecommendationEntity> findByProjectEntity_projPkNumOrderByRecLikesDesc(@Param("num") int projNum, Pageable pageable);
	
	//건의사항 게시글 반환
	RecommendationEntity findByProjectEntity_projPkNumAndRecPkNum(int projNum, int recNum);
	
	//조회수 증가
	@Modifying
    @Transactional
    @Query("UPDATE RecommendationEntity r SET r.recView = r.recView + 1 WHERE r.recPkNum = :recPkNum")
    int incrementRecView(@Param("recPkNum") int recNum);

}
