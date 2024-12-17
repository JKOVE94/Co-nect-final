package conect.data.repository;

import conect.data.entity.WikiEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WikiRepository extends JpaRepository<WikiEntity,Integer> {
}
