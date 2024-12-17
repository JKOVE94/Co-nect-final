package conect.controller;
import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;
import conect.service.Notice.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("main/{comp_pk_num}/notice")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    //프로젝트 관련 공지 게시글 전체 보기
    @GetMapping("list/{projNum}")
    public List<NoticeDto> getNotiByNotiProjNum(@PathVariable("projNum") int noti_fk_proj_num){
        System.out.println("notifknum :" + noti_fk_proj_num);
        return noticeService.getNoticeAll(noti_fk_proj_num);
    }

    //공지 게시글 하나 보기
    @GetMapping("/{notiNum}")
    public Optional<NoticeDto> getNoticeOne(@PathVariable("notiNum") int notiPkNum){
        System.out.println("notiNum:"+ notiPkNum);
        noticeService.updateCount(notiPkNum); //조회수 증가
        return noticeService.getOneNotice(notiPkNum);
    }

    //공지 게시글 수정
    @PutMapping("update/{notiPkNum}")
    public void updateNotice(@PathVariable int notiPkNum, @RequestBody NoticeForm form){
        noticeService.upNotice(notiPkNum, form);
    }

    //중요도 박스 체크 요청


    //공지 게시글 추가
    @PostMapping("/insert")
    public void addNotice(@RequestBody NoticeForm form){
        System.out.println("addForm :"+ form);
        noticeService.addNotice(form);
    }

    //공지 게시글 삭제(임시 삭제 0->1)
    @DeleteMapping("/delete/{notiNum}")
    public void deleteNotice(@PathVariable("notiNum") int notiPkNum){
        System.out.println("deleteNotiNum :" + notiPkNum);
        noticeService.delNotice(notiPkNum);
    }
}
