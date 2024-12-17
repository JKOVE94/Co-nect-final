package conect.data.repository;

import conect.data.entity.ShareEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareRepository extends JpaRepository<ShareEntity,Integer> {
}
