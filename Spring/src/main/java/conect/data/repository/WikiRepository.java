package conect.data.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import conect.data.entity.WikiEntity;

public interface WikiRepository extends JpaRepository<WikiEntity, Integer> {
	@Query("SELECT w FROM WikiEntity w JOIN FETCH w.userEntity WHERE w.wikiPkNum = :wikiPkNum")
	Optional<WikiEntity> findByIdWithUser(@Param("wikiPkNum") int wikiPkNum);
}
