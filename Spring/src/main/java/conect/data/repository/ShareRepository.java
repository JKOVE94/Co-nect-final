package conect.data.repository;

import conect.data.entity.ShareEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareRepository extends JpaRepository<ShareEntity,Integer> {
	
	//로그인한 사용자에게 공유된 todo list 반환
	List<ShareEntity> findByShareUser(int usernum);
	
	void deleteByTodoEntity_TodoPkNum(int num);
	
	ShareEntity findByShareUserAndTodoEntity_TodoPkNum(int num, int todonum);
	

}
