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
	
	// 페이징, 정렬 (Sort 포함되어 컨트롤러나 서비스에 전달)
	Page<PostEntity> findAll(Pageable pageable);
	
	// 조회수
	@Transactional
	@Modifying
    @Query("UPDATE PostEntity p SET p.postView = p.postView + 1 WHERE p.postPkNum = :postPkNum")
    int incrementView(@Param("postPkNum") Integer postPkNum);

	@Query("SELECT p FROM PostEntity p WHERE p.userEntity.userPkNum = ?1")
	List<PostEntity> getPostByTaskFkUserNum(int task_fk_user_num);
	
	//검색 - post name
	Page<PostEntity> findByPostNameContains(String searchText, Pageable pageable);
	//검색 - user name
	Page<PostEntity> findByUserEntity_UserNameContains(String searhText, Pageable pageable);
}
