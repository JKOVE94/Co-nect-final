package conect.data.repository;

import conect.data.entity.PostEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.TaskEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<ProjectEntity,Integer> {
	
	//캘린더 - 로그인한 유저가 참여한 project list 반환
	@Query(value = "SELECT proj_pk_num, proj_name, proj_desc, proj_startdate, proj_enddate, proj_status,"
			+ "proj_members, proj_created, proj_updated, proj_import, proj_tag, proj_tagcol, proj_fk_user_num, proj_fk_dpart_num, proj_fk_comp_num, proj_icon, proj_progress "
			+ " FROM project WHERE proj_members REGEXP :pattern", nativeQuery = true)
	List<ProjectEntity> findByProjMembersContaining(@Param("pattern")String pattern);
	
	 @Query("SELECT p FROM ProjectEntity p JOIN FETCH p.userEntity WHERE p.projPkNum = :projPkNum")
	    Optional<ProjectEntity> findByIdWithUser(@Param("projPkNum") int projPkNum);
	 
	 @Query("SELECT p FROM ProjectEntity p WHERE p.userEntity.userPkNum = ?1")
	    List<ProjectEntity> getProjByTaskFkUserNum(int task_fk_user_num);







}
