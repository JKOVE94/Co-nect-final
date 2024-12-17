package conect.data.repository;

import conect.data.entity.ProjectmemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectmemberRepository extends JpaRepository<ProjectmemberEntity,Integer> {
}
