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
	
	Page<RecommendationEntity> findByProjectEntity_projPkNum(int num, Pageable pageable);
	
	@Query("SELECT r FROM RecommendationEntity r " +
		       "WHERE r.projectEntity.projPkNum = :num " +
		       "ORDER BY SIZE(r.reclikesEntities) ASC")
	Page<RecommendationEntity> findByProjectEntity_projPkNumOrderByRecLikesAsc(@Param("num") int num, Pageable pageable);
	
	@Query("SELECT r FROM RecommendationEntity r " +
		       "WHERE r.projectEntity.projPkNum = :num " +
		       "ORDER BY SIZE(r.reclikesEntities) DESC")
	Page<RecommendationEntity> findByProjectEntity_projPkNumOrderByRecLikesDesc(@Param("num") int num, Pageable pageable);
	
	RecommendationEntity findByProjectEntity_projPkNumAndRecPkNum(int compnum, int recnum);
	
	@Modifying
    @Transactional
    @Query("UPDATE RecommendationEntity r SET r.recView = r.recView + 1 WHERE r.recPkNum = :recPkNum")
    int incrementRecView(@Param("recPkNum") int recnum);
	

}
