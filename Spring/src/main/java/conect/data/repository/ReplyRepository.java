package conect.data.repository;

import conect.data.entity.ReplyEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<ReplyEntity,Integer> {
	
	//그룹번호가 가장 큰 엔티티 반환
	Optional<ReplyEntity> findTopByOrderByReplyParentDesc();
	
	//그룹에 속하는 댓글 모두 삭제
	void deleteByReplyParent(int parentNum);
	
	//댓글 목록
	//정렬 기준 : 그룹 번호, 댓글 깊이, 작성일자
	//가장 최신 댓글 상단 표시
	List<ReplyEntity> findByRecommendationEntity_RecPkNumOrderByReplyParentDescReplyDepthAscReplyRegdateDesc(int recNum);
}
