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

    // 'userEntity' 관계를 즉시 로딩(Eager Fetching)하여 게시글 리스트를 가져옴
    @EntityGraph(attributePaths = {"userEntity"}) 
    List<PostEntity> findAll();

    // 페이징 및 정렬 지원 (Pageable을 사용하여 페이지와 정렬 정보 처리)
    Page<PostEntity> findAll(Pageable pageable);

    // 게시글 조회수를 증가시키는 메서드
    @Transactional // 트랜잭션 처리를 보장
    @Modifying // 데이터베이스 업데이트 쿼리임을 명시
    @Query("UPDATE PostEntity p SET p.postView = p.postView + 1 WHERE p.postPkNum = :postPkNum")
    int incrementView(@Param("postPkNum") Integer postPkNum);

    // 특정 사용자 ID(task_fk_user_num)에 해당하는 게시글 리스트 조회
    @Query("SELECT p FROM PostEntity p WHERE p.userEntity.userPkNum = ?1")
    List<PostEntity> getPostByTaskFkUserNum(int task_fk_user_num);

    // 게시글 제목(postName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<PostEntity> findByPostNameContains(String searchText, Pageable pageable);

    // 작성자 이름(userName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<PostEntity> findByUserEntity_UserNameContains(String searchText, Pageable pageable);
}