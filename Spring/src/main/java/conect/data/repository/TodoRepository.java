package conect.data.repository;

import conect.data.entity.TaskEntity;
import conect.data.entity.TodoEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TodoRepository extends JpaRepository<TodoEntity,Integer> {
	
	//로그인한 사용자의 일정 목록 반환
	List<TodoEntity> findByUserEntity_UserPkNum(int usernum);

	
	 @Query("SELECT t FROM TodoEntity t WHERE t.userEntity.userPkNum = ?1")
	 List<TodoEntity> getTodoByTaskFkUserNum(int todo_fk_user_num);
	 
	 

}
