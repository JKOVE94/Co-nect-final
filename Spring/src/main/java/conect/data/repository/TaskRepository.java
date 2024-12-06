package conect.data.repository;

import conect.data.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = ?1")
    List<TaskEntity> getTaskByTaskFkProjNum(int task_fk_proj_num);

    @Query("SELECT t FROM TaskEntity t WHERE t.userEntity.userPkNum = ?1")
    List<TaskEntity> getTaskByTaskFkUserNum(int task_fk_user_num);

    @Query("SELECT t.taskPkNum FROM TaskEntity t WHERE t.taskFkTaskNum = ?1")
    List<Integer> findChildTask(int task_pk_num);
}
