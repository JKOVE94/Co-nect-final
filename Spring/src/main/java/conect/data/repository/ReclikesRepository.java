package conect.data.repository;

import conect.data.entity.ReclikesEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclikesRepository extends JpaRepository<ReclikesEntity,Integer> {
	ReclikesEntity findByUserEntity_UserPkNumAndRecommendationEntity_RecPkNum(int usernum, int recnum);
	void deleteByRecommendationEntity_RecPkNum(int recnum);
	

}
