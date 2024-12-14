package conect.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import conect.data.entity.ShareEntity;

public interface ShareRepository extends JpaRepository<ShareEntity, Integer>{
	
	//로그인한 사용자에게 공유된 todo list 반환
	List<ShareEntity> findByShareUser(int usernum);
}
