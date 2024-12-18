package conect.data.repository;

import conect.data.entity.PostEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.TaskEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.transaction.annotation.Transactional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

	// 캘린더 - 로그인한 유저가 참여한 project list 반환
	@Query(value = "SELECT proj_pk_num, proj_name, proj_desc, proj_startdate, proj_enddate, proj_status, proj_temp,"
			+ "proj_members, proj_created, proj_updated, proj_import, proj_tag, proj_tagcol, proj_fk_user_num, proj_fk_dpart_num, proj_fk_comp_num, proj_icon, proj_progress "
			+ " FROM project WHERE proj_members REGEXP :pattern", nativeQuery = true)
	List<ProjectEntity> findByProjMembersContaining(@Param("pattern") String pattern);

//	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities WHERE p.projPkNum = :projPkNum")
//	Optional<ProjectEntity> findByIdWithUser(@Param("projPkNum") int projPkNum);
//
//	@Query("SELECT p FROM ProjectEntity p WHERE p.userEntity.userPkNum = ?1")
//	List<ProjectEntity> getProjByTaskFkUserNum(int task_fk_user_num);
//
//	// // 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
//	// Page<ProjectEntity> findAlltwo(Pageable pageable);
//
	// 프로젝트 목록 회사 num 기준으로 조회
	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities pm WHERE p.companyEntity.compPkNum = ?1")
	List<ProjectEntity> findByProjCompNum(int compNum);

	//프로젝트 목록 status에 따라 조회
	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities pm WHERE p.companyEntity.compPkNum = ?1 AND p.projStatus = ?2")
	List<ProjectEntity> findByProjCompNumAndProjStatus(int compNum, String projStatus);

	//------------------------- 2024.12.18 -------------------------

	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities pm WHERE p.companyEntity.compPkNum = ?1")
	Page<ProjectEntity> findByProjCompNumWithPaging(int compNum, Pageable pageable);

	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities pm WHERE p.companyEntity.compPkNum = ?1 AND p.projTitle LIKE %?2%")
	Page<ProjectEntity> findByProjSearchTitleWithPaging(int compNum, String searchText, Pageable pageable);

	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.projectmemberEntities pm WHERE p.companyEntity.compPkNum = ?1 AND p.projContent LIKE %?2%")
	Page<ProjectEntity> findByProjSearchContentWithPaging(int compNum, String searchText, Pageable pageable);

	// 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
//	Page<ProjectEntity> findAll(Pageable pageable);
//
//	@Query("SELECT p FROM ProjectEntity p JOIN ProjectmemberEntity pm WHERE pm.userEntity.userPkNum = ?1")
//	List<ProjectEntity> getPostByTaskFkUserNum(int task_fk_user_num);
//
//	//검색 - post name
//	Page<ProjectEntity> findByProjTitleContains(String searchText, Pageable pageable);
//	//검색 - user name
//	Page<ProjectEntity> findByUserEntity_UserNameContains(String searhText, Pageable pageable);

}
