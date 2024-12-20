package conect.data.repository;

import conect.data.entity.ProjectmemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectmemberRepository extends JpaRepository<ProjectmemberEntity,Integer> {
    @Query("SELECT p FROM ProjectmemberEntity p WHERE p.projectEntity.projPkNum = ?1")
    List<ProjectmemberEntity> findByProjmemFkProjNum(int projNum);

    @Query("SELECT p FROM ProjectmemberEntity p WHERE p.projectEntity.projPkNum = ?1 AND p.userEntity.userPkNum = ?2")
    ProjectmemberEntity findByProjmemFkProjNumAndProjmemFkUserNum(int projNum, int userNum);
}
