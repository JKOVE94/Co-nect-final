package conect.data.repository;

import conect.data.dto.ProjectDto;
import conect.data.entity.ProjectEntity;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

	ArrayList<ProjectEntity> findByCompanyEntity_CompPkNum(int compNum);
}
