package conect.data.repository;

import conect.data.entity.TaskhistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskhistoryRepository extends JpaRepository<TaskhistoryEntity, Integer> {
}
