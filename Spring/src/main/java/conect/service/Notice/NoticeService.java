package conect.service.Notice;

import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;

import java.util.List;
import java.util.Optional;

public interface NoticeService {
    //전체 조회
    List<NoticeDto> getNoticeAll(int projNum);
    //부분 조회
    Optional<NoticeDto> getOneNotice(int notiNum);
    //공지글 추가
    void addNotice(NoticeForm form);
    //공지글 수정
    void upNotice(int notiNum ,NoticeForm form);
    //공지글 삭제
    void delNotice(int notiNum);
    //페이징

    //조회수 증가
    void updateCount(int notiNum);
}
