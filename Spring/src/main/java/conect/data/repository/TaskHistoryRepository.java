package conect.data.repository;

import conect.data.entity.TaskhistoryEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskhistoryRepository extends JpaRepository<TaskhistoryEntity, Integer> {
	List<TaskhistoryEntity> findByTaskEntity_TaskPkNumOrderByTaskhisUpdatedDesc(int taskPkNum);

}
