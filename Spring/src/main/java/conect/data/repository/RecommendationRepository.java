package conect.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.RecommendationEntity;

public interface RecommendationRepository extends JpaRepository<RecommendationEntity, Integer> {
	List<RecommendationEntity> findByProjectEntity_projPkNum(int num);
}
