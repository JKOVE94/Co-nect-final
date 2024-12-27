package conect.data.repository;

import conect.data.entity.ShareEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareRepository extends JpaRepository<ShareEntity,Integer> {
	
	//로그인한 사용자에게 공유된 todo list 반환
	List<ShareEntity> findByShareUser(int userNum);
	
	//일정에 연결된 공유 엔티티 삭제
	void deleteByTodoEntity_TodoPkNum(int todoNum);
	
	//로그인한 사용자와 일정에 해당하는 엔티티 반환
	ShareEntity findByShareUserAndTodoEntity_TodoPkNum(int userNum, int todoNum);
	

}
