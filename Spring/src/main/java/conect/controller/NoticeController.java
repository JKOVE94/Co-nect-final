package conect.controller;
import conect.data.dto.NoticeDto;
import conect.data.form.NoticeForm;
import conect.service.Notice.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
        //noticeService.updateCount(notiPkNum); //조회수 증가 -> 나중에 react에서 form에 +1하고 넘겨주기
        return noticeService.getOneNotice(notiPkNum);
    }

    //조회수 증가

    //공지 게시글 수정
    @PutMapping("update/{notiPkNum}")
    public void updateNotice(@PathVariable int notiPkNum, @RequestBody NoticeForm form){
        noticeService.upNotice(notiPkNum, form);
    }

    //중요도 박스 체크 요청


    //공지 게시글 추가
    @PostMapping("/insert")
    public void addNotice(@RequestBody NoticeForm form, @PathVariable int comp_pk_num){
        form.setNoti_fk_comp_num(comp_pk_num);//경로에 있는 회사 정보 저장
        form.setNoti_regdate(LocalDate.now());//생성날짜에 현재 날짜 넣기

        System.out.println("addForm :"+ form.getNoti_regdate());
        noticeService.addNotice(form);
    }

    //공지 게시글 삭제(임시 삭제 0->1)
    @DeleteMapping("/delete/{notiNum}")
    public void deleteNotice(@PathVariable("notiNum") int notiPkNum){
        System.out.println("deleteNotiNum :" + notiPkNum);
        noticeService.delNotice(notiPkNum);
    }
}
