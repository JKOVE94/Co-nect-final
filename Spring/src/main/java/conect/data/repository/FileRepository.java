package conect.data.repository;

import conect.data.dto.FileDto;
import conect.data.entity.FileEntity;
import conect.data.entity.PostEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FileRepository extends JpaRepository<FileEntity,Integer> {
	@EntityGraph(attributePaths = {"wikiEntity"})
	List<FileEntity> findAll();
	
    @Query("SELECT f FROM FileEntity f JOIN f.wikiEntity w ORDER BY w.wikiRegdate DESC")
    Page<FileEntity> findAllWithWikiRegdate(Pageable pageable);
	
	//검색 - file name
	Page<FileEntity> findByFileNameContains(String searchText, Pageable pageable);
}
