package conect.data.repository;

import org.springframework.data.domain.Page;
import conect.data.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeEntity, Integer> {

    //projNum 기준으로 Notice리스트 불러오기
    @Query("SELECT n, n.userEntity.userName, n.projectEntity.projName FROM NoticeEntity n WHERE n.projectEntity.projPkNum = ?1")
    List<NoticeEntity> allNoticeList(int projNum);

    //하나의 프로젝트 가져오기
    @Query("SELECT n, n.userEntity.userName, n.projectEntity.projName FROM NoticeEntity n WHERE n.notiPkNum = ?1")
    Optional<NoticeEntity> getoneNotice(int notiNum);

    // notice 제목 검색용
    //Page<NoticeEntity> findNoticeByNoticeName(String searchName);

}
