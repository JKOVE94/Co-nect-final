package conect.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.ShareEntity;
import conect.data.entity.ShareId;
import conect.data.entity.TodoEntity;

public interface ShareRepository extends JpaRepository<ShareEntity, ShareId>{
	
	//로그인한 사용자에게 공유된 todo list 반환
	List<ShareEntity> findByShareUser(int usernum);
	
	void deleteByTodo_TodoPkNum(int num);

}
