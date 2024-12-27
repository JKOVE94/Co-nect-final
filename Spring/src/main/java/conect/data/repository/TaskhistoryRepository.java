package conect.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.TaskHistoryEntity;

public interface TaskHistoryRepository extends JpaRepository<TaskHistoryEntity, Integer>{
	List<TaskHistoryEntity> findByTaskEntity_TaskPkNumOrderByTaskhisUpdatedDesc(int taskPkNum);

}
