package conect.data.repository;

import conect.data.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<NoticeEntity,Integer> {
}
