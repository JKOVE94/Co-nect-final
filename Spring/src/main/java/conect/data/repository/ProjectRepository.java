package conect.data.repository;

import conect.data.entity.ProjectEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectEntity,Integer> {
	List<ProjectEntity> findByDepartmentEntity_dpartPkNum(int dpartPkNum);
}
