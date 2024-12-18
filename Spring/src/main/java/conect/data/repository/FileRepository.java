package conect.data.repository;

import conect.data.entity.FileEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity,Integer> {
	FileEntity findByWikiEntity_WikiPkNum(int wikiPkNum);
}
