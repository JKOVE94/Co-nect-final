package conect.data.repository;

import conect.data.entity.ReplyLikesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyLikesRepository extends JpaRepository<ReplyLikesEntity,Integer> {

	// 로그인한 사용자의 사번과 댓글 번호가 일치하는 엔티티 반환
	// 로그인한 사용자가 댓글에 좋아요를 눌렀는지 확인 용
	ReplyLikesEntity findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(int userNum, int replyNum);
	
	// 댓글 번호에 연결된 모든 데이터를 삭제
	void deleteByReplyEntity_ReplyPkNum(int replyNum);
}


