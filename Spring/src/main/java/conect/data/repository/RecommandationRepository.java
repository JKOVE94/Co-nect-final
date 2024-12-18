package conect.data.repository;

import conect.data.entity.RecommendationEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommandationRepository extends JpaRepository<RecommendationEntity,Integer> {
	
	List<RecommendationEntity> findByProjectEntity_projPkNum(int num);
	
}
