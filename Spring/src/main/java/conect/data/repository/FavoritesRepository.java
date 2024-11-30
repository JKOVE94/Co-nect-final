package conect.data.repository;

import conect.data.entity.FavoritesEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritesRepository extends JpaRepository<FavoritesEntity,Integer> {
	List<FavoritesEntity> findByUserEntity_userPkNum(int usernum);
}
