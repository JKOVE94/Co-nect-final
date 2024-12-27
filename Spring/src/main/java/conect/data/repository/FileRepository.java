package conect.data.repository;

import conect.data.entity.FileEntity;
import conect.data.entity.WikiEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface FileRepository extends JpaRepository<FileEntity,Integer> {
	Optional<FileEntity> findByWikiEntity(WikiEntity wikiEntity);
	 
	 Optional<FileEntity> findByWikiEntityWikiPkNum(int wikiPkNum);

}
