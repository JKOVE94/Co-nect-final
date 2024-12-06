package conect.data.repository;

import conect.data.entity.PostEntity;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
public interface PostRepository extends JpaRepository<PostEntity, Integer> {
	@EntityGraph(attributePaths = {"userEntity"})  // 'user' 관계를 함께 로딩
    List<PostEntity> findAll();
	
	Page<PostEntity> findAll(Pageable pageable);
	
	// 조회수
	@Transactional
	@Modifying
    @Query("UPDATE PostEntity p SET p.postView = p.postView + 1 WHERE p.postPkNum = :postPkNum")
    int incrementView(@Param("postPkNum") Integer postPkNum);
	
	// 임시 저장된 게시글만 조회하는 쿼리 메서드 추가
	List<PostEntity> findByPostTemp(int postTemp);

	// 특정 ID의 임시 저장 게시글만 삭제
	@Modifying
	@Transactional
	@Query("DELETE FROM PostEntity p WHERE p.postTemp = 1 AND p.postPkNum = :postPkNum")
	void deleteTemporaryById(@Param("postPkNum") int postPkNum);
}
