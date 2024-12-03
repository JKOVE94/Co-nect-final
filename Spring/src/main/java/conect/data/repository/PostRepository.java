package conect.data.repository;

import conect.data.entity.PostEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PostRepository extends JpaRepository<PostEntity, Integer> {
	@EntityGraph(attributePaths = {"userEntity"})  // 'user' 관계를 함께 로딩
    List<PostEntity> findAll();
	
	Page<PostEntity> findAll(Pageable pageable);
}