package conect.data.repository;

import conect.data.dto.FileDto;
import conect.data.entity.FileEntity;
import conect.data.entity.PostEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity,Integer> {
	
	//검색 - file name
	Page<FileEntity> findByFileNameContains(String searchText, Pageable pageable);
}
