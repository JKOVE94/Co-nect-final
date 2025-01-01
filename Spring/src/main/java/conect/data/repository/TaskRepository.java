package conect.data.repository;

import conect.data.entity.TaskEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = :task_fk_proj_num")
    List<TaskEntity> getTaskByTaskFkProjNum(@Param("task_fk_proj_num") int task_fk_proj_num);

    @Query("SELECT t FROM TaskEntity t WHERE t.userEntity.userPkNum = :task_fk_user_num")
    List<TaskEntity> getTaskByTaskFkUserNum(@Param("task_fk_user_num") int task_fk_user_num);

//    @Query("SELECT t.taskPkNum FROM TaskEntity t WHERE t.taskGroup = :task_pk_num")
//    List<Integer> findChildTask(@Param("task_pk_num") int task_pk_num);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = :projectNum AND t.userEntity.userPkNum = :userNum")
    List<TaskEntity> getTaskByProjectNumAndUserNum(@Param("projectNum") int projectNum, @Param("userNum") int userNum);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = :projPkNum AND (LOWER(t.taskTitle) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(t.taskContent) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    Page<TaskEntity> findByProjectEntity_ProjPkNumAndTitleOrContent(@Param("projPkNum") int projPkNum,
            @Param("searchText") String searchText, Pageable pageable);

    Page<TaskEntity> findByProjectEntity_ProjPkNum(int projPkNum, Pageable pageable);

    @Query("SELECT t FROM TaskEntity t WHERE t.taskGroup = ?1 AND t.taskDepth = 1")
    List<TaskEntity> findRelatedTaskLists(int taskPkNum);

    @Query("SELECT t.taskPkNum FROM TaskEntity t WHERE t.taskGroup = ?1 AND t.taskDepth = 1")
    List<Integer> findChildTask(int task_pk_num);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = ?1 AND t.taskTitle LIKE %?2%")
    List<TaskEntity> getTaskBySearchingTitle(int projectNum, String searchValue);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectEntity.projPkNum = ?1 AND t.userEntity.userName LIKE %?2%")
    List<TaskEntity> getTaskBySearchingUser(int projectNum, String searchValue);

}
