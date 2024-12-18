package conect.data.repository;

import conect.data.entity.PostEntity;
import conect.data.entity.ProjectEntity;
import conect.data.entity.TaskEntity;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.google.api.gax.paging.Page;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

//	@Query("SELECT p FROM ProjectEntity p JOIN FETCH p.userEntity WHERE p.projPkNum = :projPkNum")
//	Optional<ProjectEntity> findByIdWithUser(@Param("projPkNum") int projPkNum);

//	@Query("SELECT p FROM ProjectEntity p WHERE p.userEntity.userPkNum = ?1")
//	List<ProjectEntity> getProjByTaskFkUserNum(int task_fk_user_num);

	// // 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
	// Page<ProjectEntity> findAlltwo(Pageable pageable);

	// 프로젝트 목록 회사 num 기준으로 조회
//	@Query("SELECT p, p.userEntity.userName, p.userEntity.userMail FROM ProjectEntity p WHERE p.companyEntity.compPkNum = :compNum")
//	List<ProjectEntity> findByProjCompNum(@Param("compNum") int compNum);

}