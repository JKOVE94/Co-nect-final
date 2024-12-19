package conect.data.repository;

import conect.data.entity.ReplyEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<ReplyEntity,Integer> {
	
	Optional<ReplyEntity> findTopByOrderByReplyParentDesc();
	List<ReplyEntity> findByRecommendationEntity_RecPkNum(int num);
	List<ReplyEntity> findByRecommendationEntity_RecPkNumOrderByReplyParentAscReplyRegdateAsc(int recPkNum);
}
