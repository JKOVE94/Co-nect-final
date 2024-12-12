package conect.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import conect.data.entity.ShareEntity;

public interface ShareRepository extends JpaRepository<ShareEntity, String>{

}
