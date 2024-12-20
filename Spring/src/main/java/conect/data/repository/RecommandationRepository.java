package conect.data.repository;

import conect.data.entity.RecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommandationRepository extends JpaRepository<RecommendationEntity,Integer> {
}
