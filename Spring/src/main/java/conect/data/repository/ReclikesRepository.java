package conect.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.ReclikesEntity;

public interface ReclikesRepository extends JpaRepository<ReclikesEntity, Integer> {
	
	//List<ReclikesEntity> 

}
