package conect.data.repository;

import conect.data.entity.NoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeEntity, Integer> {

        // projNum 기준으로 Notice리스트 불러오기 + 조건 임시 삭제 추가 + 상단 고정 맨 위 노출 + 생성일자 최신순 + 페이징 기능
        // 추가
        @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = ?1 AND n.notiDeleted != 1" +
                        "ORDER BY n.notiImport DESC")
        Page<NoticeEntity> allNoticeList(int projPkNum, Pageable pageable);

        // 제목 검색 조회
        @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = :projPkNum AND n.notiDeleted != 1 " +
                        "AND n.notiTitle LIKE %:searchText%")
        Page<NoticeEntity> searchNoticeTitle(int projPkNum, String searchText, Pageable pageable);

        // 작성자 검색 조회
        @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = :projPkNum AND n.notiDeleted != 1 " +
                        "AND n.userEntity.userName LIKE %:searchText%")
        Page<NoticeEntity> searchNoticeUserName(int projPkNum, String searchText, Pageable pageable);

        // 하나의 프로젝트 가져오기
        @Query("SELECT n FROM NoticeEntity n WHERE n.notiPkNum = ?1")
        Optional<NoticeEntity> getOneNotice(int notiNum);

        // 임시삭제 기능
        @Modifying
        @Query("UPDATE NoticeEntity n SET n.notiDeleted = 1 WHERE n.notiPkNum = ?1")
        void delOneNotice(int notiNum);

}
