package conect.data.repository;

import conect.data.entity.ReclikesEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclikesRepository extends JpaRepository<ReclikesEntity,Integer> {
	
	// 로그인한 사용자의 사번과 건의사항 게시글 번호가 일치하는 엔티티 반환
	// 로그인한 사용자가 건의사항 게시글에 좋아요를 눌렀는지 확인 용
	ReclikesEntity findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(int userNum, int recNum);
	
	List<ReclikesEntity> findByRecommendationEntity_RecPkNum(int recNum);

	// 건의사항 게시글 번호에 연결된 모든 데이터를 삭제
	void deleteByRecommendationEntity_RecPkNum(int recNum);
	

}
