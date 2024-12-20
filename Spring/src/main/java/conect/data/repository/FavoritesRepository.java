package conect.data.repository;

import conect.data.entity.FavoritesEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritesRepository extends JpaRepository<FavoritesEntity,Integer> {
	
	List<FavoritesEntity> findByUserEntity_userPkNum(int usernum);
	
	FavoritesEntity findByUserEntity_userPkNumAndProjectEntity_projPkNum(int userNum, int projNum);
	
	FavoritesEntity findByUserEntity_userPkNumAndPostEntity_postPkNum(int userNum, int postNum);
}
