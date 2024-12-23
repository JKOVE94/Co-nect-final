package conect.service.Notice;

import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;


public interface NoticeService {
    //전체 조회 + 검색기능
    Page<NoticeDto> getNoticeAll(int projNum, int page, int size,
                                 String sortField, String sortDirection,
                                 String searchType, String searchText);
    //부분 조회
    Optional<NoticeDto> getOneNotice(int notiNum ,HttpServletRequest request ,HttpServletResponse response);
    //공지글 추가
    void addNotice(NoticeForm form);
    //공지글 수정
    void upNotice(int notiNum ,NoticeForm form);
    //공지글 삭제
    void delNotice(int notiNum);
    //조회수 증가
    void incrementViewCount(int notiNum);

}
