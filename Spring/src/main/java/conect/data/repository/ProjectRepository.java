package conect.data.repository;

import conect.data.dto.UserDto;
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

	// 캘린더 - 로그인한 유저가 참여한 project list 반환
	@Query(value = "SELECT p FROM project p WHERE proj_members REGEXP :pattern", nativeQuery = true)
	List<ProjectEntity> findByProjMembersContaining(@Param("pattern") String pattern);

	@Query("SELECT p FROM ProjectEntity p LEFT JOIN FETCH p.projectmemberEntities pm LEFT JOIN FETCH pm.userEntity WHERE p.projPkNum = :projPkNum")
	Optional<ProjectEntity> findByIdWithUser(@Param("projPkNum") int projPkNum);

	@Query("SELECT DISTINCT p FROM ProjectEntity p JOIN p.projectmemberEntities pm WHERE pm.userEntity.userPkNum = :userPkNum")
	List<ProjectEntity> getProjByTaskFkUserNum(@Param("userPkNum") int userPkNum);


	// // 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
	// Page<ProjectEntity> findAlltwo(Pageable pageable);

	// 프로젝트 목록 회사 num 기준으로 조회
	@Query("SELECT p FROM ProjectEntity p WHERE p.companyEntity.compPkNum = :compNum")
	List<ProjectEntity> findByProjCompNum(@Param("compNum") int compNum);
	
	// 검색용
	//List<ProjectEntity> findByProjStatusContainsAndProjNameContains(String status, String searchText);

}
