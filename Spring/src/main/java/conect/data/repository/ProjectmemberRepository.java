package conect.data.repository;
import conect.data.entity.ProjectEntity;
import conect.data.entity.ProjectmemberEntity;
import conect.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectmemberRepository extends JpaRepository<ProjectmemberEntity,Integer> {
    
    // ProjectEntity로 ProjectmemberEntity를 찾는 메서드
    Optional<ProjectmemberEntity> findByProjectEntity(ProjectEntity projectEntity);

    // ProjectEntity와 UserEntity로 함께 찾는 메서드
    Optional<ProjectmemberEntity> findByProjectEntityAndUserEntity(ProjectEntity projectEntity, UserEntity userEntity);

}
