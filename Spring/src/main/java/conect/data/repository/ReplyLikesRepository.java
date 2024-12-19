package conect.data.repository;

import conect.data.entity.ReplyLikesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyLikesRepository extends JpaRepository<ReplyLikesEntity,Integer> {
	ReplyLikesEntity findByUserEntity_UserPkNumAndReplyEntity_ReplyPkNum(int usernum, int replynum);
	void deleteByReplyEntity_ReplyPkNum(int replynum);
}
