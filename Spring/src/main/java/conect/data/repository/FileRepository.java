package conect.data.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import conect.data.entity.FileEntity;

public interface FileRepository extends JpaRepository<FileEntity, Integer>{
	// 페이징 및 정렬 지원 (Pageable을 사용하여 페이지와 정렬 정보 처리)
    Page<FileEntity> findAll(Pageable pageable);

    // 게시글 조회수를 증가시키는 메서드
    @Transactional // 트랜잭션 처리를 보장
    @Modifying // 데이터베이스 업데이트 쿼리임을 명시
    @Query("UPDATE FileEntity f SET f.fileDownload = f.fileDownload + 1 WHERE f.filePkNum = :filePkNum")
    int incrementView(@Param("filePkNum") Integer filePkNum);

//    // 특정 사용자 ID(task_fk_user_num)에 해당하는 게시글 리스트 조회
//    @Query("SELECT f FROM FileEntity f WHERE f.userEntity.userPkNum = ?1")
//    List<FileEntity> getPostByTaskFkUserNum(int task_fk_user_num);

    // 파일명(fileName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<FileEntity> findByFileNameContains(String searchText, Pageable pageable);

    // 작성자 이름(userName)에 검색어가 포함된 게시글을 페이징 처리하여 검색
    Page<FileEntity> findByUserEntity_UserNameContains(String searchText, Pageable pageable);
}
