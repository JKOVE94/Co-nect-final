package conect.data.repository;

import conect.data.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeEntity,Integer> {

    //projNum 기준으로 Notice리스트 불러오기 + 조건 임시 삭제 추가
    @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = ?1 AND n.notiDeleted != 1")
    List<NoticeEntity> allNoticeList(int projPkNum);

    //하나의 프로젝트 가져오기
    @Query("SELECT n FROM NoticeEntity n WHERE n.notiPkNum = ?1")
    Optional<NoticeEntity> getOneNotice(int notiNum);

    //제목 검색 조회
    @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = ?1 AND n.notiDeleted != 1 " +
            "AND n.notiTitle LIKE %?2%")
    List<NoticeEntity> searchNoticeTitle(int projPkNum, String searchText);

    //작성자 검색 조회
    @Query("SELECT n FROM NoticeEntity n WHERE n.projectEntity.projPkNum = ?1 AND n.notiDeleted != 1 " +
            "AND n.userEntity.userName LIKE %?2%")
    List<NoticeEntity> searchNoticeUserName(int projPkNum, String searchText);

    //임시삭제 기능
    @Modifying
    @Query("UPDATE NoticeEntity n SET n.notiDeleted = 1 WHERE n.notiPkNum = ?1")
    void delOneNotice(int notiNum);

    // notice 제목 검색용
    //Page<NoticeEntity> findNoticeByNoticeName(String searchName);

    //중요도 체크박스 설정
    @Modifying
    @Query("UPDATE NoticeEntity n SET n.notiImport = 1 WHERE n.notiPkNum = ?1")
    void checkBox(int notiNum);

    //중요도 체크박스 해제
    @Modifying
    @Query("UPDATE NoticeEntity n SET n.notiImport = 0 WHERE n.notiPkNum = ?1")
    void unCheckBox(int notiNum);

    //조회수 1증가
    @Modifying
    @Query("UPDATE NoticeEntity n SET n.notiView = n.notiView + 1 WHERE n.notiPkNum = ?1")
    void updateCount(int notiNum);

}
